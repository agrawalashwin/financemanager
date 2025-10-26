# Quick Start Guide

## 🚀 Deploy to App Engine in 5 Steps

Your GCP Project: **mobiuschatgpt**

### Step 1: Authenticate with gcloud

```bash
gcloud auth login
```

### Step 2: Create Backend Environment File

```bash
cd backend
cp .env.yaml.example .env.yaml
```

Edit `backend/.env.yaml` and set:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Your database credentials
- `GOOGLE_CLIENT_ID` - Get from Google Cloud Console (see step 4)
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `AUTH_BYPASS` - Set to `"false"`

### Step 3: Deploy Backend

```bash
cd backend
gcloud app deploy app.yaml
```

Wait 5-10 minutes for first deployment. You'll get a URL like:
`https://mobiuschatgpt.uc.r.appspot.com`

### Step 4: Set Up Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials?project=mobiuschatgpt

2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**

3. Configure OAuth consent screen (if needed):
   - User Type: **External**
   - App name: `Financial Manager`
   - Your email for support and developer contact
   - Click through all steps

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Financial Manager`
   - **Authorized JavaScript origins:**
     - `https://mobiuschatgpt.uc.r.appspot.com`
   - **Authorized redirect URIs:**
     - `https://mobiuschatgpt.uc.r.appspot.com`
   - Click **CREATE**

5. **Copy the Client ID**

6. Update `backend/.env.yaml` with the Client ID

7. Redeploy backend:
   ```bash
   cd backend
   gcloud app deploy app.yaml
   ```

### Step 5: Deploy Frontend

```bash
cd frontend

# Create production environment file
cat > .env.production << 'EOF'
VITE_API_URL=https://mobiuschatgpt.uc.r.appspot.com/api
VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
VITE_AUTH_BYPASS=false
EOF

# Build and deploy
npm install
npm run build
gcloud app deploy app.yaml
```

### Step 6: Test Your App! 🎉

Open: https://mobiuschatgpt.uc.r.appspot.com

1. Click "Sign in with Google"
2. Authenticate
3. You're in! (First user becomes admin)

---

## 🛠️ Alternative: Use Deployment Script

We've created a handy deployment script:

```bash
./deploy.sh
```

Choose:
1. Backend only
2. Frontend only
3. Both

---

## 🗄️ Database Options

### Option A: Cloud SQL (Recommended)

```bash
# Create instance
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
```

Update `backend/.env.yaml`:
```yaml
DB_HOST: "/cloudsql/mobiuschatgpt:us-central1:financialmanager-db"
```

Update `backend/app.yaml`:
```yaml
beta_settings:
  cloud_sql_instances: mobiuschatgpt:us-central1:financialmanager-db
```

### Option B: External Database

Use Supabase, ElephantSQL, AWS RDS, or any PostgreSQL database.

Just set the connection details in `backend/.env.yaml`:
```yaml
DB_HOST: "your-db-host.com"
DB_USER: "your-user"
DB_PASSWORD: "your-password"
DB_NAME: "financialmanager"
DB_PORT: "5432"
```

---

## 🔧 Useful Commands

```bash
# View logs
gcloud app logs tail

# View app in browser
gcloud app browse

# List versions
gcloud app versions list

# Delete old version
gcloud app versions delete VERSION_ID

# Check project
gcloud config get-value project

# Switch project
gcloud config set project PROJECT_ID
```

---

## 🐛 Troubleshooting

### "Not authenticated" error
```bash
gcloud auth login
```

### "App Engine not initialized" error
```bash
gcloud app create --region=us-central
```

### Database connection error
- Check credentials in `.env.yaml`
- For Cloud SQL, verify connection name in `app.yaml`
- Check database is running: `gcloud sql instances list`

### OAuth redirect mismatch
- Verify authorized origins in Google Cloud Console
- Make sure URLs match exactly (no trailing slashes)
- Wait a few minutes for changes to propagate

### Build errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 More Documentation

- **DEPLOY_NOW.md** - Detailed deployment guide
- **DEPLOYMENT.md** - Complete deployment documentation
- **GOOGLE_OAUTH_SETUP.md** - OAuth setup guide
- **AUTH_IMPLEMENTATION_SUMMARY.md** - Auth system overview

---

## 💰 Cost Estimate

With Google Cloud Free Tier:
- **App Engine F1**: Free up to 28 instance hours/day
- **Cloud SQL db-f1-micro**: 1 free instance
- **Egress**: 1 GB/month free

Low-traffic apps should stay within free tier! 🎉

---

## 🎯 What You Get

✅ **Secure Authentication** - Google OAuth 2.0
✅ **Role-Based Access** - 4 roles with granular permissions
✅ **Scalable Infrastructure** - Auto-scaling with App Engine
✅ **HTTPS by Default** - Secure connections
✅ **Global CDN** - Fast loading worldwide
✅ **Easy Updates** - Just run `gcloud app deploy`

---

## 🆘 Need Help?

1. Check logs: `gcloud app logs tail`
2. Check browser console for errors
3. Review documentation files
4. Check App Engine status: https://status.cloud.google.com/

---

## 🎉 You're All Set!

Your Financial Manager app is now running on Google Cloud Platform with:
- Professional authentication
- Role-based access control
- Scalable infrastructure
- Secure HTTPS connections

Enjoy! 🚀

