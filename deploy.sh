#!/bin/bash

# Deployment script for Financial Manager to Google App Engine
# Project: mobiuschatgpt

set -e  # Exit on error

echo "🚀 Financial Manager - App Engine Deployment"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Get current project
PROJECT=$(gcloud config get-value project 2>/dev/null)
echo -e "${GREEN}✓ Project: $PROJECT${NC}"
echo ""

# Menu
echo "What would you like to deploy?"
echo "1) Backend only"
echo "2) Frontend only"
echo "3) Both (backend first, then frontend)"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying Backend..."
        echo "----------------------"
        
        # Check if .env.yaml exists
        if [ ! -f "backend/.env.yaml" ]; then
            echo -e "${RED}❌ backend/.env.yaml not found${NC}"
            echo "Create it from backend/.env.yaml.example"
            echo "See DEPLOY_NOW.md for instructions"
            exit 1
        fi
        
        cd backend
        echo "Running: gcloud app deploy app.yaml"
        gcloud app deploy app.yaml
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
        echo ""
        echo "Backend URL:"
        gcloud app browse --no-launch-browser
        ;;
        
    2)
        echo ""
        echo "📦 Deploying Frontend..."
        echo "------------------------"
        
        # Check if .env.production exists
        if [ ! -f "frontend/.env.production" ]; then
            echo -e "${YELLOW}⚠️  frontend/.env.production not found${NC}"
            echo "Creating from .env.example..."
            cp frontend/.env.example frontend/.env.production
            echo -e "${YELLOW}⚠️  Please edit frontend/.env.production with your backend URL${NC}"
            exit 1
        fi
        
        cd frontend
        
        echo "Installing dependencies..."
        npm install
        
        echo "Building production bundle..."
        npm run build
        
        echo "Deploying to App Engine..."
        gcloud app deploy app.yaml
        
        echo ""
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
        echo ""
        echo "Frontend URL:"
        gcloud app browse --no-launch-browser
        ;;
        
    3)
        echo ""
        echo "📦 Deploying Backend and Frontend..."
        echo "------------------------------------"
        
        # Deploy backend first
        if [ ! -f "backend/.env.yaml" ]; then
            echo -e "${RED}❌ backend/.env.yaml not found${NC}"
            echo "Create it from backend/.env.yaml.example"
            exit 1
        fi
        
        echo "Step 1/2: Deploying Backend..."
        cd backend
        gcloud app deploy app.yaml
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo ""
        
        # Get backend URL
        BACKEND_URL=$(gcloud app browse --no-launch-browser 2>&1 | grep -o 'https://[^[:space:]]*')
        echo "Backend URL: $BACKEND_URL"
        echo ""
        
        # Deploy frontend
        if [ ! -f "frontend/.env.production" ]; then
            echo "Creating frontend/.env.production..."
            cat > frontend/.env.production << EOF
VITE_API_URL=${BACKEND_URL}/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_AUTH_BYPASS=false
EOF
            echo -e "${YELLOW}⚠️  Please edit frontend/.env.production with your Google Client ID${NC}"
            echo "Then run this script again and choose option 2"
            exit 1
        fi
        
        echo "Step 2/2: Deploying Frontend..."
        cd frontend
        npm install
        npm run build
        gcloud app deploy app.yaml
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Both services deployed successfully!${NC}"
        echo ""
        echo "App URL:"
        gcloud app browse --no-launch-browser
        ;;
        
    4)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Set up Google OAuth (see GOOGLE_OAUTH_SETUP.md)"
echo "2. Update authorized origins in Google Cloud Console"
echo "3. Test your app!"
echo ""
echo "View logs: gcloud app logs tail"
echo "View app: gcloud app browse"
echo ""

