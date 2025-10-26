#!/bin/bash

# Cloud SQL Setup Script for Financial Manager
# Project: mobiuschatgpt

set -e  # Exit on error

echo "🗄️  Setting up Cloud SQL for Financial Manager"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT="mobiuschatgpt"
INSTANCE_NAME="financialmanager-db"
REGION="us-central1"
DB_NAME="financialmanager"

echo "Project: $PROJECT"
echo "Instance: $INSTANCE_NAME"
echo "Region: $REGION"
echo ""

# Generate a secure password
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)
echo -e "${GREEN}✓ Generated secure database password${NC}"
echo ""

# Step 1: Create Cloud SQL instance
echo "Step 1/5: Creating Cloud SQL instance..."
echo "This will take about 5-10 minutes..."
echo ""

gcloud sql instances create $INSTANCE_NAME \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --project=$PROJECT

echo ""
echo -e "${GREEN}✓ Cloud SQL instance created${NC}"
echo ""

# Step 2: Set postgres password
echo "Step 2/5: Setting postgres password..."
gcloud sql users set-password postgres \
  --instance=$INSTANCE_NAME \
  --password="$DB_PASSWORD" \
  --project=$PROJECT

echo -e "${GREEN}✓ Password set${NC}"
echo ""

# Step 3: Create database
echo "Step 3/5: Creating database..."
gcloud sql databases create $DB_NAME \
  --instance=$INSTANCE_NAME \
  --project=$PROJECT

echo -e "${GREEN}✓ Database created${NC}"
echo ""

# Step 4: Get connection name
echo "Step 4/5: Getting connection details..."
CONNECTION_NAME=$(gcloud sql instances describe $INSTANCE_NAME \
  --format="value(connectionName)" \
  --project=$PROJECT)

echo -e "${GREEN}✓ Connection name: $CONNECTION_NAME${NC}"
echo ""

# Step 5: Update backend/.env.yaml
echo "Step 5/5: Updating backend/.env.yaml..."

cat > backend/.env.yaml << EOF
env_variables:
  NODE_ENV: "production"
  
  # Database Configuration - Cloud SQL
  DB_HOST: "/cloudsql/$CONNECTION_NAME"
  DB_USER: "postgres"
  DB_PASSWORD: "$DB_PASSWORD"
  DB_PORT: "5432"
  DB_NAME: "$DB_NAME"
  
  # Google OAuth Configuration
  GOOGLE_CLIENT_ID: "908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com"
  
  # JWT Secret
  JWT_SECRET: "zFvkgZhuWyyBWxjw5rLPqMDj5kEy4BB9COYFKlFQFfU="
  
  # Auth Bypass - MUST be "false" in production
  AUTH_BYPASS: "false"
  
  # Server Port
  PORT: "8080"
EOF

echo -e "${GREEN}✓ backend/.env.yaml updated${NC}"
echo ""

# Update backend/app.yaml
echo "Updating backend/app.yaml with Cloud SQL connection..."

cat > backend/app.yaml << EOF
runtime: nodejs20

env: standard

instance_class: F1

automatic_scaling:
  min_instances: 0
  max_instances: 2
  target_cpu_utilization: 0.65

# Include environment variables from .env.yaml
includes:
  - .env.yaml

# Cloud SQL connection
beta_settings:
  cloud_sql_instances: $CONNECTION_NAME

handlers:
- url: /.*
  script: auto
  secure: always
EOF

echo -e "${GREEN}✓ backend/app.yaml updated${NC}"
echo ""

# Save credentials to a file
cat > .cloudsql-credentials.txt << EOF
============================================
Cloud SQL Credentials
============================================

Instance Name: $INSTANCE_NAME
Connection Name: $CONNECTION_NAME
Database Name: $DB_NAME
Database User: postgres
Database Password: $DB_PASSWORD

============================================
IMPORTANT: Keep this file secure!
============================================
EOF

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Cloud SQL Setup Complete!${NC}"
echo "=============================================="
echo ""
echo "Instance: $INSTANCE_NAME"
echo "Connection: $CONNECTION_NAME"
echo "Database: $DB_NAME"
echo ""
echo -e "${YELLOW}⚠️  Database credentials saved to: .cloudsql-credentials.txt${NC}"
echo -e "${YELLOW}⚠️  Keep this file secure and do NOT commit it to git!${NC}"
echo ""
echo "Next steps:"
echo "1. Run database migrations (see below)"
echo "2. Deploy backend: cd backend && gcloud app deploy app.yaml"
echo "3. Deploy frontend: cd frontend && npm run build && gcloud app deploy app.yaml"
echo ""
echo "To run migrations:"
echo "  gcloud sql connect $INSTANCE_NAME --user=postgres --project=$PROJECT"
echo "  Then paste the SQL from backend/schema.sql and migration files"
echo ""

