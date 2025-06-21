#!/bin/bash

# 🚀 Push Alchemorsel Images to Docker Hub
# Run this script after building the images locally

set -e

echo "🔐 Logging into Docker Hub..."
echo "Please enter your Docker Hub credentials when prompted."
docker login

echo ""
echo "📤 Pushing frontend image..."
docker push alchemorsel/frontend:v1.2.0

echo ""
echo "📤 Pushing backend image..."
docker push alchemorsel/backend:v1.2.0

echo ""
echo "✅ All images pushed successfully!"
echo ""
echo "🔍 You can verify the images at:"
echo "   Frontend: https://hub.docker.com/r/alchemorsel/frontend"
echo "   Backend:  https://hub.docker.com/r/alchemorsel/backend"
echo ""
echo "🚀 Ready for deployment! Use these images in your production docker-compose.yml"