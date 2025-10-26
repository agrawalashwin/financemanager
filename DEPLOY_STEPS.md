# Deployment Steps - Ready to Execute

## 🎯 Current Status

✅ Google Client ID configured
✅ JWT Secret generated
✅ Configuration files ready
✅ Cloud SQL setup script created

## 📋 Execute These Steps

### Step 1: Authenticate (IN PROGRESS)

You should see a URL in your terminal. Open it in your browser and:
1. Sign in with your Google account
2. Grant permissions
3. Copy the verification code
4. Paste it back in the terminal

### Step 2: Run Cloud SQL Setup Script

Once authenticated, run:

```bash
./setup-cloudsql.sh
```

This will:
- Create Cloud SQL instance (takes ~5-10 minutes)
- Generate secure database password
- Create database
- Update `backend/.env.yaml` with connection details
- Update `backend/app.yaml` with Cloud SQL connection
- Save credentials to `.cloudsql-credentials.txt`

### Step 3: Run Database Migrations

```bash
# Connect to Cloud SQL
gcloud sql connect financialmanager-db --user=postgres --project=mobiuschatgpt

# You'll be prompted for the password (check .cloudsql-credentials.txt)

# Then run these commands in the PostgreSQL prompt:
```

Copy and paste the contents of these files in order:

1. **backend/schema.sql** - Main schema
2. **backend/migrations/001_add_recurring_group.sql** - Recurring transactions
3. **backend/migrations/002_add_one_time_frequency.sql** - One-time frequency
4. **backend/src/migrations/003_create_auth_tables.sql** - Auth tables

Type `\q` to exit when done.

### Step 4: Update Google OAuth Authorized Origins

1. Go to: https://console.cloud.google.com/apis/credentials?project=mobiuschatgpt

2. Click on your OAuth Client ID: `908206088809-049m6i5s5pgl1g3cefddeki0rbcm99ij.apps.googleusercontent.com`

3. Add these URLs:

   **Authorized JavaScript origins:**
   - `https://mobiuschatgpt.uc.r.appspot.com`

   **Authorized redirect URIs:**
   - `https://mobiuschatgpt.uc.r.appspot.com`

4. Click **Save**

### Step 5: Deploy Backend

```bash
cd backend
gcloud app deploy app.yaml --project=mobiuschatgpt
```

This takes 5-10 minutes for first deployment.

### Step 6: Deploy Frontend

```bash
cd frontend
npm install
npm run build
gcloud app deploy app.yaml --project=mobiuschatgpt
```

This takes 3-5 minutes.

### Step 7: Test Your App! 🎉

```bash
gcloud app browse --project=mobiuschatgpt
```

Or go directly to: **https://mobiuschatgpt.uc.r.appspot.com**

1. Click "Sign in with Google"
2. Authenticate
3. You're in! (First user becomes admin)

## 🚀 Alternative: Use Automated Script

After authentication, you can use the deployment script:

```bash
./deploy.sh
```

Choose option 3 (deploy both).

## 📝 Important Files

- `.cloudsql-credentials.txt` - Database credentials (created by setup script)
- `backend/.env.yaml` - Backend environment variables
- `frontend/.env.production` - Frontend environment variables

**⚠️ Do NOT commit these files to git!**

## 🐛 Troubleshooting

### Cloud SQL Creation Fails

```bash
# Check if instance already exists
gcloud sql instances list --project=mobiuschatgpt

# If it exists, delete it first
gcloud sql instances delete financialmanager-db --project=mobiuschatgpt
```

### Deployment Fails

```bash
# Check logs
gcloud app logs tail --project=mobiuschatgpt

# Check App Engine status
gcloud app describe --project=mobiuschatgpt
```

### Database Connection Error

```bash
# Test connection
gcloud sql connect financialmanager-db --user=postgres --project=mobiuschatgpt

# Check instance status
gcloud sql instances describe financialmanager-db --project=mobiuschatgpt
```

## ⏱️ Time Estimates

- Cloud SQL creation: 5-10 minutes
- Database migrations: 2-3 minutes
- Backend deployment: 5-10 minutes (first time)
- Frontend deployment: 3-5 minutes
- **Total: ~20-30 minutes**

## ✅ Success Checklist

- [ ] Authenticated with gcloud
- [ ] Cloud SQL instance created
- [ ] Database migrations run
- [ ] Google OAuth origins updated
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] App tested and working

## 🎉 What You'll Have

After successful deployment:
- ✅ App running at: `https://mobiuschatgpt.uc.r.appspot.com`
- ✅ Google OAuth authentication
- ✅ Cloud SQL PostgreSQL database
- ✅ Auto-scaling infrastructure
- ✅ HTTPS by default
- ✅ Role-based access control

## 📞 Next Steps

Once deployed:
1. Test all features
2. Add more users
3. Assign roles to users
4. Set up monitoring (optional)
5. Configure custom domain (optional)

---

**Ready? Let's do this! 🚀**

Start with Step 1 (authenticate) and work through each step.

