# Care Navigator

Care Navigator is a web application that helps users find and apply for social service programs and benefits based on their specific situation. The application uses Google Cloud's Vertex AI to analyze user input and provide personalized recommendations.

## Architecture

The application consists of two main components:

1. **Frontend React Application**: A Vite-based React application with TypeScript and Material UI that provides the user interface.

2. **Backend Cloud Functions**: Python-based Google Cloud Functions that integrate with Vertex AI to provide AI-powered features:
   - `analyze-situation`: Analyzes a user's situation and recommends relevant benefit programs
   - `generate-response`: Generates responses to user questions about benefit programs

## Features

- User-friendly interface for describing personal situations
- AI-powered analysis of user needs
- Personalized program recommendations
- Interactive chat for asking questions about programs
- Step-by-step application process for selected programs

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Google Cloud account
- Python 3.11 (for local Cloud Function development)

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with your Cloud Function URLs:
   ```
   VITE_ANALYZE_SITUATION_URL=YOUR_ANALYZE_SITUATION_FUNCTION_URL
   VITE_GENERATE_RESPONSE_URL=YOUR_GENERATE_RESPONSE_FUNCTION_URL
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Cloud Functions Setup

See the [Cloud Functions README](./cloud-functions/README.md) for detailed instructions on deploying and testing the Cloud Functions.

## Development Workflow

1. The application starts with the user describing their situation on the Experience Input page.
2. When the user submits their situation, it's sent to the `analyze-situation` Cloud Function.
3. The Cloud Function uses Vertex AI to analyze the situation and recommend relevant programs.
4. The recommended programs are displayed to the user in the Program Explorer.
5. The user can ask questions about the programs, which are answered by the `generate-response` Cloud Function.
6. The user can select programs they're interested in and proceed with the application process.

## Fallback Mechanism

The application includes a fallback mechanism that uses mock data if the Cloud Functions are not available or not configured. This ensures that the application can be demonstrated and tested without a live connection to Google Cloud.

## Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

1. Build the application:
   ```
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your hosting service.

### Cloud Functions Deployment

See the [Cloud Functions README](./cloud-functions/README.md) for detailed deployment instructions.

## License

[MIT](LICENSE)
