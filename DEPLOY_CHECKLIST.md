# Deployment Checklist

## ✅ What's Already Done

- [x] Google Client ID configured: `908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com`
- [x] JWT Secret generated: `zFvkgZhuWyyBWxjw5rLPqMDj5kEy4BB9COYFKlFQFfU=`
- [x] Backend `.env.yaml` created with Client ID and JWT secret
- [x] Frontend `.env.production` created with Client ID
- [x] App Engine configuration files ready
- [x] Deployment script created (`deploy.sh`)

## 📋 What You Need to Do

### Step 1: Authenticate with gcloud ⚠️ **DO THIS FIRST**

```bash
gcloud auth login
```

This will open a browser window for you to authenticate.

### Step 2: Choose Database Option

You have two options:

#### Option A: Create Cloud SQL Instance (Recommended)

```bash
# Create PostgreSQL instance (takes ~5 minutes)
gcloud sql instances create financialmanager-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Set password (choose a strong password!)
gcloud sql users set-password postgres \
  --instance=financialmanager-db \
  --password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create financialmanager \
  --instance=financialmanager-db

# Get connection name
gcloud sql instances describe financialmanager-db --format="value(connectionName)"
# This will output something like: mobiuschatgpt:us-central1:financialmanager-db
```

Then update `backend/.env.yaml`:
```yaml
DB_HOST: "/cloudsql/mobiuschatgpt:us-central1:financialmanager-db"
DB_USER: "postgres"
DB_PASSWORD: "YOUR_SECURE_PASSWORD"
DB_NAME: "financialmanager"
```

And update `backend/app.yaml` to add:
```yaml
beta_settings:
  cloud_sql_instances: mobiuschatgpt:us-central1:financialmanager-db
```

#### Option B: Use External Database (Faster Setup)

If you have a database elsewhere (Supabase, ElephantSQL, AWS RDS, etc.):

Update `backend/.env.yaml`:
```yaml
DB_HOST: "your-external-db-host.com"
DB_USER: "your-db-user"
DB_PASSWORD: "your-db-password"
DB_NAME: "financialmanager"
DB_PORT: "5432"
```

### Step 3: Run Database Migrations

Once your database is set up, run the migrations:

```bash
# If using Cloud SQL, connect via proxy:
gcloud sql connect financialmanager-db --user=postgres

# Then run migrations:
\i /path/to/backend/schema.sql
\i /path/to/backend/migrations/001_add_recurring_group.sql
\i /path/to/backend/migrations/002_add_one_time_frequency.sql
\i /path/to/backend/src/migrations/003_create_auth_tables.sql
```

Or if using external database:
```bash
psql -h your-host -U your-user -d financialmanager -f backend/schema.sql
psql -h your-host -U your-user -d financialmanager -f backend/migrations/001_add_recurring_group.sql
psql -h your-host -U your-user -d financialmanager -f backend/migrations/002_add_one_time_frequency.sql
psql -h your-host -U your-user -d financialmanager -f backend/src/migrations/003_create_auth_tables.sql
```

### Step 4: Update Google OAuth Authorized Origins

1. Go to: https://console.cloud.google.com/apis/credentials?project=mobiuschatgpt

2. Click on your OAuth Client ID: `908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com`

3. Add **Authorized JavaScript origins:**
   - `https://mobiuschatgpt.uc.r.appspot.com`

4. Add **Authorized redirect URIs:**
   - `https://mobiuschatgpt.uc.r.appspot.com`

5. Click **Save**

### Step 5: Deploy Backend

```bash
cd backend
gcloud app deploy app.yaml
```

This will take 5-10 minutes for the first deployment.

### Step 6: Deploy Frontend

```bash
cd frontend
npm install
npm run build
gcloud app deploy app.yaml
```

### Step 7: Test Your App! 🎉

```bash
gcloud app browse
```

Or go to: https://mobiuschatgpt.uc.r.appspot.com

1. Click "Sign in with Google"
2. Authenticate with your Google account
3. You should be redirected to the dashboard
4. First user becomes admin automatically!

## 🚀 Quick Deploy (If Database is Ready)

If you already have a database configured:

```bash
# 1. Authenticate
gcloud auth login

# 2. Use the deployment script
./deploy.sh

# 3. Choose option 3 (deploy both)

# 4. Wait for deployment to complete

# 5. Open your app
gcloud app browse
```

## 🔍 Verify Configuration

Before deploying, verify these files:

### `backend/.env.yaml`
```yaml
env_variables:
  GOOGLE_CLIENT_ID: "908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com"
  JWT_SECRET: "zFvkgZhuWyyBWxjw5rLPqMDj5kEy4BB9COYFKlFQFfU="
  AUTH_BYPASS: "false"
  DB_HOST: "your-db-host"  # ⚠️ UPDATE THIS
  DB_PASSWORD: "your-db-password"  # ⚠️ UPDATE THIS
```

### `frontend/.env.production`
```env
VITE_API_URL=https://mobiuschatgpt.uc.r.appspot.com/api
VITE_GOOGLE_CLIENT_ID=908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com
VITE_AUTH_BYPASS=false
```

## 🐛 Troubleshooting

### Authentication Error
```bash
gcloud auth login
```

### Database Connection Error
- Check credentials in `backend/.env.yaml`
- For Cloud SQL, verify connection name in `app.yaml`
- Test connection: `gcloud sql connect financialmanager-db --user=postgres`

### OAuth Redirect Mismatch
- Verify authorized origins in Google Cloud Console
- Make sure URLs match exactly: `https://mobiuschatgpt.uc.r.appspot.com`
- No trailing slashes!
- Wait a few minutes for changes to propagate

### Deployment Fails
```bash
# Check logs
gcloud app logs tail

# Verify project
gcloud config get-value project

# Check App Engine status
gcloud app describe
```

## 📊 Deployment Status

- [ ] Step 1: Authenticated with gcloud
- [ ] Step 2: Database configured
- [ ] Step 3: Database migrations run
- [ ] Step 4: Google OAuth origins updated
- [ ] Step 5: Backend deployed
- [ ] Step 6: Frontend deployed
- [ ] Step 7: App tested and working

## 🎯 Expected Result

After successful deployment:
- ✅ App URL: `https://mobiuschatgpt.uc.r.appspot.com`
- ✅ Google OAuth login working
- ✅ First user becomes admin
- ✅ Dashboard loads with data
- ✅ All features working

## 📞 Next Steps After Deployment

1. Test all features
2. Add more users and assign roles
3. Set up monitoring and alerts
4. Configure custom domain (optional)
5. Set up CI/CD pipeline (optional)

## 💡 Tips

- First deployment takes 5-10 minutes
- Subsequent deployments are faster (~2-3 minutes)
- Use `gcloud app logs tail` to debug issues
- Check browser console for frontend errors
- First user to sign in becomes admin automatically

## 🆘 Need Help?

- Check logs: `gcloud app logs tail`
- View app: `gcloud app browse`
- Check status: `gcloud app describe`
- Review docs: `QUICK_START.md`, `DEPLOYMENT.md`

---

## ⚡ TL;DR - Quick Commands

```bash
# 1. Authenticate
gcloud auth login

# 2. Set up database (choose one option from Step 2 above)

# 3. Update backend/.env.yaml with database credentials

# 4. Update Google OAuth origins at:
# https://console.cloud.google.com/apis/credentials?project=mobiuschatgpt

# 5. Deploy
./deploy.sh
# Choose option 3

# 6. Open app
gcloud app browse
```

---

**You're almost there! Just need to:**
1. Run `gcloud auth login`
2. Set up database
3. Deploy!

Good luck! 🚀

