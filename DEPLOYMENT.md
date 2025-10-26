# Deployment Guide - Google App Engine

This guide will help you deploy the Financial Manager application to Google App Engine.

## Prerequisites

- Google Cloud Platform (GCP) account
- GCP project created
- `gcloud` CLI installed ([Install Guide](https://cloud.google.com/sdk/docs/install))
- Cloud SQL PostgreSQL instance (or use Cloud SQL Proxy for local PostgreSQL)

## Architecture

The application consists of two services:
1. **Backend API** - Express.js server (Node.js)
2. **Frontend** - React SPA (Static files)

Both will be deployed as separate App Engine services.

## Step 1: Install and Configure gcloud CLI

```bash
# Install gcloud CLI (if not already installed)
# Follow: https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Select your GCP project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

## Step 2: Set Up Cloud SQL (PostgreSQL)

### Option A: Create a new Cloud SQL instance

```bash
# Create Cloud SQL instance
gcloud sql instances create financialmanager-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Set root password
gcloud sql users set-password postgres \
  --instance=financialmanager-db \
  --password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create financialmanager \
  --instance=financialmanager-db

# Get connection name (you'll need this)
gcloud sql instances describe financialmanager-db --format="value(connectionName)"
```

### Option B: Use existing PostgreSQL database

If you have an existing PostgreSQL database, you can use it by configuring the connection string in the environment variables.

## Step 3: Configure Backend Environment Variables

Create a file `backend/.env.yaml` for App Engine environment variables:

```yaml
env_variables:
  NODE_ENV: "production"
  
  # Database Configuration
  DB_USER: "postgres"
  DB_PASSWORD: "YOUR_SECURE_PASSWORD"
  DB_HOST: "/cloudsql/YOUR_PROJECT_ID:us-central1:financialmanager-db"
  DB_PORT: "5432"
  DB_NAME: "financialmanager"
  
  # Google OAuth
  GOOGLE_CLIENT_ID: "your_google_client_id.apps.googleusercontent.com"
  
  # JWT Secret (generate a strong random string)
  JWT_SECRET: "your_super_secret_jwt_key_change_this"
  
  # Auth Bypass (MUST be false in production)
  AUTH_BYPASS: "false"
```

**Important:** Add `.env.yaml` to `.gitignore` to avoid committing secrets!

## Step 4: Update Backend app.yaml

The `backend/app.yaml` file should include Cloud SQL connection:

```yaml
runtime: nodejs20

env: standard

instance_class: F1

automatic_scaling:
  min_instances: 0
  max_instances: 2
  target_cpu_utilization: 0.65

# Include environment variables
includes:
  - .env.yaml

# Cloud SQL connection
beta_settings:
  cloud_sql_instances: YOUR_PROJECT_ID:us-central1:financialmanager-db

handlers:
- url: /.*
  script: auto
  secure: always
```

## Step 5: Deploy Backend

```bash
cd backend

# Run database migrations (one-time setup)
# Connect to Cloud SQL and run migrations
gcloud sql connect financialmanager-db --user=postgres
# Then run your SQL migration files

# Deploy backend
gcloud app deploy app.yaml

# Get backend URL
gcloud app browse --service=default
# Example: https://YOUR_PROJECT_ID.uc.r.appspot.com
```

## Step 6: Configure Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://YOUR_PROJECT_ID.uc.r.appspot.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_AUTH_BYPASS=false
```

## Step 7: Build and Deploy Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy frontend
gcloud app deploy app.yaml --version=v1

# Get frontend URL
gcloud app browse
# Example: https://YOUR_PROJECT_ID.uc.r.appspot.com
```

## Step 8: Update Google OAuth Authorized Origins

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add **Authorized JavaScript origins:**
   - `https://YOUR_PROJECT_ID.uc.r.appspot.com`
4. Add **Authorized redirect URIs:**
   - `https://YOUR_PROJECT_ID.uc.r.appspot.com`
5. Click **Save**

## Step 9: Test the Deployment

1. Open your frontend URL: `https://YOUR_PROJECT_ID.uc.r.appspot.com`
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. You should be redirected to the dashboard

## Local Development with Auth Bypass

For local development, you can bypass authentication:

### Backend `.env`:
```env
AUTH_BYPASS=true
NODE_ENV=development
```

### Frontend `.env`:
```env
VITE_AUTH_BYPASS=true
VITE_API_URL=http://localhost:5000/api
```

This will automatically log you in as an admin user without requiring Google OAuth.

**⚠️ WARNING:** Never enable `AUTH_BYPASS` in production!

## Deployment Commands Reference

### Deploy Backend Only
```bash
cd backend
gcloud app deploy app.yaml
```

### Deploy Frontend Only
```bash
cd frontend
npm run build
gcloud app deploy app.yaml
```

### View Logs
```bash
# Backend logs
gcloud app logs tail -s default

# Frontend logs
gcloud app logs tail
```

### View App
```bash
gcloud app browse
```

### Set Environment Variables (Alternative to .env.yaml)
```bash
gcloud app deploy --set-env-vars="KEY1=value1,KEY2=value2"
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Check Cloud SQL instance is running:
   ```bash
   gcloud sql instances list
   ```

2. Verify connection name in `app.yaml`:
   ```bash
   gcloud sql instances describe financialmanager-db --format="value(connectionName)"
   ```

3. Check database credentials in `.env.yaml`

### OAuth Redirect Mismatch

If you get "redirect_uri_mismatch" error:

1. Verify authorized origins in Google Cloud Console
2. Make sure URLs match exactly (no trailing slashes)
3. Wait a few minutes for changes to propagate

### Build Errors

If frontend build fails:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check for TypeScript errors:
   ```bash
   npm run build
   ```

### App Engine Quota Exceeded

If you hit quota limits:

1. Check your quotas:
   ```bash
   gcloud app instances list
   ```

2. Adjust `max_instances` in `app.yaml`

3. Consider upgrading to a paid tier

## Cost Optimization

- Use `F1` instance class for low-traffic apps (free tier eligible)
- Set `min_instances: 0` to scale to zero when not in use
- Use Cloud SQL `db-f1-micro` tier for development (free tier eligible)
- Monitor usage in [GCP Console](https://console.cloud.google.com/billing)

## Security Best Practices

1. **Never commit secrets** - Add `.env`, `.env.yaml`, `.env.production` to `.gitignore`
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Enable HTTPS only** - Set `secure: always` in `app.yaml`
4. **Rotate secrets regularly** - Update JWT_SECRET and database passwords
5. **Disable AUTH_BYPASS in production** - Always set to `false`
6. **Use IAM roles** - Restrict access to Cloud SQL and App Engine
7. **Enable Cloud Armor** - Add DDoS protection for production apps

## Continuous Deployment

For automated deployments, consider using:

- **Cloud Build** - Trigger deployments on git push
- **GitHub Actions** - CI/CD pipeline with gcloud CLI
- **GitLab CI/CD** - Automated testing and deployment

Example GitHub Actions workflow:

```yaml
name: Deploy to App Engine

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup gcloud CLI
        uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Deploy Backend
        run: |
          cd backend
          gcloud app deploy app.yaml --quiet
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          gcloud app deploy app.yaml --quiet
```

## Support

For issues or questions:
- Check [App Engine Documentation](https://cloud.google.com/appengine/docs)
- Review [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- Check application logs: `gcloud app logs tail`

