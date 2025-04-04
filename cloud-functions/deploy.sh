#!/bin/bash
# Script to deploy Cloud Functions to Google Cloud

# Check if project ID is provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh PROJECT_ID [REGION]"
  echo "Example: ./deploy.sh my-project-id us-central1"
  exit 1
fi

PROJECT_ID=$1
REGION=${2:-"us-central1"}  # Default to us-central1 if not specified

echo "Deploying Cloud Functions to project: $PROJECT_ID in region: $REGION"

# Deploy analyze-situation function
echo "Deploying analyze-situation function..."
cd analyze-situation
gcloud functions deploy analyze-situation \
  --gen2 \
  --runtime=python311 \
  --region=$REGION \
  --source=. \
  --entry-point=analyze_situation \
  --trigger-http \
  --allow-unauthenticated \
  --project=$PROJECT_ID \
  --set-env-vars=GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "analyze-situation function deployed successfully!"
  ANALYZE_URL=$(gcloud functions describe analyze-situation --gen2 --region=$REGION --project=$PROJECT_ID --format="value(serviceConfig.uri)")
  echo "Function URL: $ANALYZE_URL"
else
  echo "Failed to deploy analyze-situation function."
  exit 1
fi

# Deploy generate-response function
echo "Deploying generate-response function..."
cd ../generate-response
gcloud functions deploy generate-response \
  --gen2 \
  --runtime=python311 \
  --region=$REGION \
  --source=. \
  --entry-point=generate_response \
  --trigger-http \
  --allow-unauthenticated \
  --project=$PROJECT_ID \
  --set-env-vars=GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION

# Check if deployment was successful
if [ $? -eq 0 ]; then
  echo "generate-response function deployed successfully!"
  GENERATE_URL=$(gcloud functions describe generate-response --gen2 --region=$REGION --project=$PROJECT_ID --format="value(serviceConfig.uri)")
  echo "Function URL: $GENERATE_URL"
else
  echo "Failed to deploy generate-response function."
  exit 1
fi

echo ""
echo "Deployment completed successfully!"
echo ""
echo "To configure your React app to use these functions, add the following environment variables:"
echo ""
echo "REACT_APP_ANALYZE_SITUATION_URL=$ANALYZE_URL"
echo "REACT_APP_GENERATE_RESPONSE_URL=$GENERATE_URL"
echo ""
echo "You can add these to a .env file in your project root or configure them in your hosting environment."
