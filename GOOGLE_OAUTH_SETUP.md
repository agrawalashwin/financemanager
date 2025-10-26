# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Financial Manager application.

## Prerequisites

- A Google Cloud Platform (GCP) account
- Access to your GCP project

## Step 1: Enable Google+ API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google+ API" or "Google Identity"
5. Click **Enable**

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **Internal** (if using Google Workspace) or **External**
   - Fill in the required fields:
     - App name: `Financial Manager`
     - User support email: Your email
     - Developer contact email: Your email
   - Click **Save and Continue**
   - Skip the Scopes step (click **Save and Continue**)
   - Skip the Test users step (click **Save and Continue**)
   - Click **Back to Dashboard**

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Financial Manager Web Client`
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (for development)
     - Add your production URL when deploying
   - **Authorized redirect URIs:**
     - `http://localhost:5173` (for development)
     - Add your production URL when deploying
   - Click **CREATE**

5. Copy the **Client ID** (you'll need this for the .env files)

## Step 3: Configure Backend

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Google Client ID:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   JWT_SECRET=your_random_secret_key_here
   ```

4. Make sure your database credentials are correct in `.env`

## Step 4: Configure Frontend

1. Navigate to the `frontend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   VITE_API_URL=http://localhost:5000/api
   ```

## Step 5: Start the Application

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Step 6: Test Login

1. Click the **Sign in with Google** button
2. Select your Google account
3. Grant permissions
4. You should be redirected to the dashboard

## User Roles

The application has 4 roles with different permissions:

### Admin
- **Full access** to all modules
- Can manage users and assign roles
- First user to sign in automatically becomes admin

### Manager
- Can **view and edit** Dashboard, Transactions, Budgets
- Can **view** Reports
- **No access** to Settings or User Management

### Analyst
- Can **view** Dashboard and Reports
- Can **view and edit** Transactions and Budgets
- **No access** to Settings or User Management

### Viewer
- Can **view** Dashboard and Transactions only
- **No access** to Budgets, Reports, Settings, or User Management

## Managing User Roles (Admin Only)

As an admin, you can manage user roles:

1. Log in as an admin
2. Navigate to **Settings** > **User Management** (coming soon)
3. Select a user and change their role
4. The user will need to log out and log back in for changes to take effect

## Troubleshooting

### "Google OAuth not configured" error
- Make sure `GOOGLE_CLIENT_ID` is set in `backend/.env`
- Restart the backend server after adding the environment variable

### "Google Client ID is not configured" error
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in `frontend/.env`
- Restart the frontend dev server after adding the environment variable

### "Redirect URI mismatch" error
- Make sure `http://localhost:5173` is added to **Authorized JavaScript origins** in Google Cloud Console
- Make sure `http://localhost:5173` is added to **Authorized redirect URIs** in Google Cloud Console

### "Access denied" error
- Check that the user has the correct role assigned
- Check that the module permissions are set correctly in the database

## Security Notes

- **Never commit `.env` files** to version control
- Use strong, random values for `JWT_SECRET` in production
- In production, use HTTPS for all URLs
- Regularly rotate your JWT secret
- Consider implementing token refresh for better security

## Production Deployment

When deploying to production:

1. Update **Authorized JavaScript origins** in Google Cloud Console with your production URL
2. Update **Authorized redirect URIs** with your production URL
3. Update `VITE_API_URL` in frontend `.env` to your production API URL
4. Use environment variables in your hosting platform (Vercel, Netlify, etc.)
5. Never expose your `.env` files publicly

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure the database migration ran successfully

