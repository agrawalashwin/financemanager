# Quick Deployment Guide - App Engine

Your project: **mobiuschatgpt**

## Step 1: Authenticate with gcloud

Run this command in your terminal:

```bash
gcloud auth login
```

This will open a browser window for you to authenticate.

## Step 2: Check if App Engine is initialized

```bash
gcloud app describe
```

If you get an error saying App Engine is not initialized, run:

```bash
gcloud app create --region=us-central
```

Choose a region close to you (e.g., `us-central`, `us-east1`, `europe-west1`, etc.)

## Step 3: Create Backend Environment Variables

Create `backend/.env.yaml`:

```bash
cd backend
cat > .env.yaml << 'EOF'
env_variables:
  NODE_ENV: "production"
  
  # Database - You'll need to set up Cloud SQL or use external DB
  DB_USER: "postgres"
  DB_PASSWORD: "your_secure_password"
  DB_HOST: "localhost"  # Or Cloud SQL connection
  DB_PORT: "5432"
  DB_NAME: "financialmanager"
  
  # Google OAuth - Get from console.cloud.google.com
  GOOGLE_CLIENT_ID: "your_client_id.apps.googleusercontent.com"
  
  # JWT Secret - Generate a strong random string
  JWT_SECRET: "your_super_secret_jwt_key_change_this"
  
  # Auth Bypass - MUST be false in production
  AUTH_BYPASS: "false"
EOF
```

**Important:** Edit this file and replace the placeholder values!

## Step 4: Deploy Backend

```bash
cd backend
gcloud app deploy app.yaml
```

This will:
- Build your Node.js app
- Deploy to App Engine
- Give you a URL like: `https://mobiuschatgpt.uc.r.appspot.com`

**Note:** The first deployment may take 5-10 minutes.

## Step 5: Get Your Backend URL

After deployment completes, get your URL:

```bash
gcloud app browse
```

Copy this URL - you'll need it for the frontend!

## Step 6: Set Up Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials?project=mobiuschatgpt

2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**

3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `Financial Manager`
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** through all steps

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Financial Manager`
   - **Authorized JavaScript origins:**
     - `https://mobiuschatgpt.uc.r.appspot.com`
   - **Authorized redirect URIs:**
     - `https://mobiuschatgpt.uc.r.appspot.com`
   - Click **CREATE**

5. **Copy the Client ID** - you'll need it for both backend and frontend!

## Step 7: Update Backend with Google Client ID

Edit `backend/.env.yaml` and update:

```yaml
GOOGLE_CLIENT_ID: "your_actual_client_id.apps.googleusercontent.com"
```

Then redeploy:

```bash
cd backend
gcloud app deploy app.yaml
```

## Step 8: Configure Frontend

Create `frontend/.env.production`:

```bash
cd frontend
cat > .env.production << 'EOF'
VITE_API_URL=https://mobiuschatgpt.uc.r.appspot.com/api
VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
VITE_AUTH_BYPASS=false
EOF
```

**Important:** Replace `your_actual_client_id` with the Client ID from Step 6!

## Step 9: Build Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with your production build.

## Step 10: Deploy Frontend

```bash
cd frontend
gcloud app deploy app.yaml
```

## Step 11: Test Your App!

Open your app:

```bash
gcloud app browse
```

Or go directly to: `https://mobiuschatgpt.uc.r.appspot.com`

You should see:
1. Login page with Google sign-in button
2. Click to authenticate with Google
3. First user becomes admin automatically
4. Redirected to dashboard

## Troubleshooting

### Database Connection Issues

If you get database errors, you have two options:

**Option A: Use Cloud SQL (Recommended for production)**

```bash
# Create Cloud SQL instance
gcloud sql instances create financialmanager-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Set password
gcloud sql users set-password postgres \
  --instance=financialmanager-db \
  --password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create financialmanager \
  --instance=financialmanager-db

# Get connection name
gcloud sql instances describe financialmanager-db --format="value(connectionName)"
```

Then update `backend/.env.yaml`:

```yaml
DB_HOST: "/cloudsql/mobiuschatgpt:us-central1:financialmanager-db"
```

And update `backend/app.yaml`:

```yaml
beta_settings:
  cloud_sql_instances: mobiuschatgpt:us-central1:financialmanager-db
```

**Option B: Use External Database**

If you have a database hosted elsewhere (e.g., Supabase, ElephantSQL, AWS RDS):

Update `backend/.env.yaml` with your external database credentials:

```yaml
DB_HOST: "your-external-db-host.com"
DB_USER: "your-db-user"
DB_PASSWORD: "your-db-password"
DB_NAME: "financialmanager"
DB_PORT: "5432"
```

### OAuth Redirect Mismatch

If you get "redirect_uri_mismatch" error:

1. Check authorized origins in Google Cloud Console
2. Make sure URLs match exactly (no trailing slashes)
3. Wait a few minutes for changes to propagate

### Build Errors

If frontend build fails:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Quick Commands Reference

```bash
# View logs
gcloud app logs tail

# View app in browser
gcloud app browse

# List deployed versions
gcloud app versions list

# Delete old versions
gcloud app versions delete VERSION_ID

# SSH into instance (for debugging)
gcloud app instances ssh INSTANCE_ID
```

## Cost Estimate

With the free tier:
- **App Engine F1 instances**: Free up to 28 instance hours/day
- **Cloud SQL db-f1-micro**: Free up to 1 instance
- **Egress**: 1 GB/month free

For low-traffic apps, this should stay within the free tier!

## Next Steps After Deployment

1. ✅ Test login with your Google account
2. ✅ Verify you're assigned admin role (first user)
3. ✅ Test all navigation and permissions
4. ✅ Add more users and assign roles
5. ✅ Set up custom domain (optional)
6. ✅ Enable Cloud Armor for DDoS protection (optional)
7. ✅ Set up monitoring and alerts (optional)

## Support

If you run into issues:
- Check logs: `gcloud app logs tail`
- Check browser console for errors
- Review `DEPLOYMENT.md` for detailed troubleshooting
- Check `GOOGLE_OAUTH_SETUP.md` for OAuth setup details

