import functions_framework
from flask import jsonify

# --- Use Vertex AI specific imports ---
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig, Part, FinishReason # Import Part

# --- Standard imports ---
import os
import json
import logging

# --- Initialize Logging ---
logging.basicConfig(level=logging.INFO)

# --- System Instruction (Copied from your 'chatbot' function) ---
SYSTEM_INSTRUCTION = """You are a specialized AI assistant that lives on a benefits navigation page. Your primary role is to provide helpful, accurate, and informative answers to user questions about social services and public benefits available in Colorado. Your tone should always be empathetic, patient, clear, respectful, objective, and non-judgmental. You are here to help users understand programs and answer any questions they may have.

Your knowledge domain is in Colorado based social services and public benefits and you take a holistic, strengths-based view of getting people connected with help. You should leverage publicly available information from the internet. Prioritize information from trusted, official government sources from the state of Colorado, including cdhs.colorado.gov, hcpf.colorado.gov, cdphe.colorado.gov, or federal government websites like usda.gov, hhs.gov.

Your main function is to answer user questions about these programs. This includes explaining what a program is and its general purpose, explaining eligibility concepts (like income limits, residency, household definitions) in simple terms. Do not explicitly state eligibility in definitive terms. Provide information about the application process and what type of documentation is required. Define comon acronyms and terms related to social services.

Use plain, simple language. Avoid jargon or explain it clearly. Break down complex information so it is easy to understand. Use lists or bullet points where helpful. Maintain a high level of accuracy and base factual claims on trusted sources. If information is not verifiable from a trusted source, state that explicitly.

Be helpful and aim to genuinely assist the user, who might be in a difficult situation. Do not express personal opinions or biases about programs or user situations ever. Provide information concisely without being overly verbose.

NEVER ask for personally identifiable information of any kind. Do NOT provide financial, legal, medical, or therapeutic advice.

CRITICAL SAFETY PROTOCOL: If a person indicates they may be in mental health crisis or in immediate danger, refer them to 988 for mental health crisis and 911 for emergencies immediately.
"""

# --- Initialize Vertex AI ---
try:
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    region = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    if not project_id:
        logging.error("CRITICAL: GOOGLE_CLOUD_PROJECT environment variable not found.")
    aiplatform.init(project=project_id, location=region)
    logging.info(f"Vertex AI initialized for project '{project_id}' in location '{region}'")
except Exception as e:
    logging.error(f"CRITICAL: Error initializing Vertex AI: {e}", exc_info=True)

# --- Model Configuration ---
MODEL_NAME = "gemini-1.5-flash-001" # Or your preferred available model


@functions_framework.http
def generate_response(request):
    """
    HTTP Cloud Function that generates responses for a benefits assistant chatbot
    using Vertex AI Gemini. Handles conversation history and uses a detailed system instruction.
    """
    # --- CORS Handling ---
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*', # Restrict in production
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*' # Restrict in production
    }

    if request.method != 'POST':
         logging.warning(f"Received non-POST request: {request.method}")
         return (jsonify({'error': 'Method not allowed. Use POST.'}), 405, headers)

    # --- Main Request Logic ---
    try:
        request_json = request.get_json(silent=True)

        # --- Input Validation ---
        if not request_json:
             logging.warning("Request body is missing or not valid JSON.")
             return (jsonify({'error': 'Invalid JSON request body.'}), 400, headers)
        # Check for 'question' (user's latest message)
        if 'question' not in request_json:
            logging.warning("Request JSON missing 'question' field.")
            return (jsonify({'error': 'Missing required field: question'}), 400, headers)

        question = request_json['question']
        # Get optional program context and conversation history
        programs_context = request_json.get('programs', []) # Context about specific programs
        # Expect history in the format: [{"role": "user"|"model", "parts": [{"text": "..."}]}]
        # IMPORTANT: Ensure frontend sends history in this Vertex AI compatible format
        history_from_request = request_json.get('history', [])

        logging.info(f"Received question (first 100 chars): {question[:100]}...")
        if history_from_request:
            logging.info(f"Received conversation history with {len(history_from_request)} turns.")

        # Call Vertex AI to generate a response, passing history
        response_text = generate_with_vertex_ai(question, history_from_request, programs_context)

        # Return the results
        return (jsonify({'response': response_text}), 200, headers)

    except Exception as e:
        logging.exception(f"An unexpected error occurred in generate_response: {str(e)}")
        return (jsonify({'error': f'An internal server error occurred.'}), 500, headers)

def generate_with_vertex_ai(question: str, history_from_request: list = None, programs_context: list = None) -> str:
    """
    Generates a response using Vertex AI Gemini with a direct generation approach.
    No chat history or chat interface is used - just direct prompt generation.

    Args:
        question (str): The user's latest question.
        history_from_request (list, optional): Not used in this simplified version.
        programs_context (list, optional): List of programs for added context this turn.

    Returns:
        str: The generated text response, or an error message.
    """
    try:
        # --- Use Vertex AI SDK ---
        model = GenerativeModel(MODEL_NAME)

        # --- Construct the full prompt ---
        # Start with system instruction
        full_prompt = f"{SYSTEM_INSTRUCTION}\n\n"
        
        # Add program context if available
        if programs_context and len(programs_context) > 0:
            full_prompt += "--- Context on Relevant Programs for this question ---\n"
            for program in programs_context:
                prog_name = program.get('name', 'Unknown Program')
                prog_desc = program.get('description', 'N/A')
                prog_elig = program.get('potentialEligibility', program.get('eligibility', 'N/A'))
                full_prompt += f"- {prog_name}: {prog_desc} (Potential Eligibility Notes: {prog_elig})\n"
            full_prompt += "-----------------------------------------------------\n\n"
        
        # Add the user's question
        full_prompt += f"User question: {question}\n\nYour response:"
        
        logging.info(f"Sending direct prompt to model {MODEL_NAME}...")
        
        # Generate content directly without using chat
        response = model.generate_content(full_prompt)
        logging.info("Received response from Vertex AI.")
        
        # Return the response text
        return response.text

    except Exception as e:
        logging.exception(f"Error during Vertex AI chat interaction: {str(e)}")
        return "Sorry, I encountered an error trying to generate a response. Please try again."
