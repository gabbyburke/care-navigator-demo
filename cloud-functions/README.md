# Cloud Functions for Care Navigator

This directory contains two Google Cloud Functions that integrate with Vertex AI to provide AI-powered features for the Care Navigator application:

1. `analyze-situation`: Analyzes a user's situation and recommends relevant benefit programs
2. `generate-response`: Generates responses to user questions about benefit programs

## Manual Deployment Steps

### Prerequisites

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Log in to your Google Cloud account:
   ```
   gcloud auth login
   ```
3. Set your project ID:
   ```
   gcloud config set project YOUR_PROJECT_ID
   ```
4. Enable required APIs:
   ```
   gcloud services enable cloudfunctions.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com run.googleapis.com aiplatform.googleapis.com
   ```

### Deploy analyze-situation Function

1. Navigate to the analyze-situation directory:
   ```
   cd analyze-situation
   ```

2. Deploy the function:
   ```
   gcloud functions deploy analyze-situation \
     --gen2 \
     --runtime=python311 \
     --region=us-central1 \
     --source=. \
     --entry-point=analyze_situation \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars=GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1
   ```

3. Get the function URL:
   ```
   gcloud functions describe analyze-situation --gen2 --region=us-central1 --format="value(serviceConfig.uri)"
   ```

### Deploy generate-response Function

1. Navigate to the generate-response directory:
   ```
   cd ../generate-response
   ```

2. Deploy the function:
   ```
   gcloud functions deploy generate-response \
     --gen2 \
     --runtime=python311 \
     --region=us-central1 \
     --source=. \
     --entry-point=generate_response \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars=GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1
   ```

3. Get the function URL:
   ```
   gcloud functions describe generate-response --gen2 --region=us-central1 --format="value(serviceConfig.uri)"
   ```

## Testing the Functions

### Test analyze-situation Function

You can test the analyze-situation function using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"situation": "I am a single parent with two kids, working part-time. I am having trouble paying rent and need help with childcare so I can work more hours."}' \
  FUNCTION_URL
```

Replace `FUNCTION_URL` with the URL of your deployed analyze-situation function.

### Test generate-response Function

You can test the generate-response function using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I apply for SNAP benefits?", "programs": [{"id": 2, "name": "SNAP Benefits", "description": "Helps low-income individuals and families buy healthy food.", "eligibility": "Based on household size and monthly income"}]}' \
  FUNCTION_URL
```

Replace `FUNCTION_URL` with the URL of your deployed generate-response function.

## Configuring the React Application

After deploying the functions, you need to configure the React application to use them:

1. Create a `.env` file in the root of your project with the following content:
   ```
   VITE_ANALYZE_SITUATION_URL=YOUR_ANALYZE_SITUATION_FUNCTION_URL
   VITE_GENERATE_RESPONSE_URL=YOUR_GENERATE_RESPONSE_FUNCTION_URL
   ```

2. Replace `YOUR_ANALYZE_SITUATION_FUNCTION_URL` and `YOUR_GENERATE_RESPONSE_FUNCTION_URL` with the URLs of your deployed functions.

   Note: Vite uses the `VITE_` prefix for environment variables that should be exposed to the client-side code.

3. Restart your development server for the changes to take effect.

## Local Testing

You can also test the functions locally before deploying them to Google Cloud:

1. Install the Functions Framework:
   ```
   pip install functions-framework
   ```

2. Run the analyze-situation function locally:
   ```
   cd analyze-situation
   functions-framework --target=analyze_situation --debug
   ```

3. In a separate terminal, test the function:
   ```
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"situation": "I am a single parent with two kids, working part-time. I am having trouble paying rent and need help with childcare so I can work more hours."}' \
     http://localhost:8080
   ```

4. Similarly, you can test the generate-response function locally:
   ```
   cd generate-response
   functions-framework --target=generate_response --debug
   ```

5. Test the function:
   ```
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"question": "How do I apply for SNAP benefits?"}' \
     http://localhost:8080
   ```

Note: For local testing, you'll need to set up authentication for Vertex AI. The easiest way is to use the Google Cloud CLI:

```
gcloud auth application-default login
```

This will create application default credentials that the Cloud Functions can use locally.
