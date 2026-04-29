# Troubleshooting 500 Internal Server Error

## Current Status
✅ Frontend is connecting to production backend (`https://biz-auto.onrender.com`)
❌ Backend is returning 500 error when trying to save data

## Most Likely Causes
1. Database tables don't exist (migrations didn't run)
2. PostgreSQL database not connected
3. Missing environment variables on Render

## Step 1: Check Health Endpoint
I've added a health check endpoint. Visit this URL in your browser:
```
https://biz-auto.onrender.com/api/businesses/health/
```

This will show you:
- Database connection status
- Whether tables exist
- Debug mode status

## Step 2: Check Render Logs
1. Go to https://dashboard.render.com
2. Click on your `biz-auto` service
3. Click "Logs" tab
4. Try submitting the form again from your website
5. Look for error messages in the logs

Common errors to look for:
- `relation "businesses_business" does not exist` → Migrations didn't run
- `could not connect to server` → Database not connected
- `FATAL: password authentication failed` → Wrong database credentials

## Step 3: Verify Render Configuration

### Build Command (should be):
```bash
cd backend && pip install -r requirements-prod.txt && python manage.py collectstatic --no-input && python manage.py migrate --noinput
```

### Start Command (should be):
```bash
cd backend && gunicorn config.wsgi:application
```

### Environment Variables (must have):
```
DATABASE_URL=<your-postgres-url>
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=biz-auto.onrender.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://aquamarine-gerbil-514131.hostingersite.com,http://localhost:5173,http://localhost:3000
```

## Step 4: Manual Migration (if needed)
If migrations didn't run during build, you can run them manually:

1. Go to Render dashboard → your service
2. Click "Shell" tab (or use SSH)
3. Run these commands:
```bash
cd backend
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

## Step 5: Check PostgreSQL Database
Make sure you have a PostgreSQL database created on Render:
1. Go to Render dashboard
2. Click "New +" → "PostgreSQL"
3. Create a free PostgreSQL database
4. Copy the "Internal Database URL"
5. Add it as `DATABASE_URL` environment variable in your web service

## Step 6: Force Redeploy
After making any changes:
1. Go to your service in Render
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete (~2-3 minutes)
4. Check logs for any errors

## What to Share for Further Help
If the issue persists, please share:
1. The output from the health check endpoint
2. The error message from Render logs (when you submit the form)
3. Screenshot of your Environment variables (hide sensitive values)
4. Whether you have a PostgreSQL database created on Render

## Quick Fix Checklist
- [ ] PostgreSQL database created on Render
- [ ] DATABASE_URL environment variable set
- [ ] Build command includes `python manage.py migrate`
- [ ] CORS_ALLOWED_ORIGINS includes your Hostinger URL
- [ ] Service redeployed after changes
- [ ] Health check endpoint returns "healthy"
