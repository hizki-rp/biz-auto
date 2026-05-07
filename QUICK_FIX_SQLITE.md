# Quick Fix: Use SQLite Temporarily

Since we're having issues connecting to Hostinger MySQL (likely remote access is blocked), let's use SQLite temporarily so you can test the application.

## Step 1: Remove MySQL Environment Variables from Render

Go to Render dashboard → `biz-auto` service → **Environment** tab

**Remove or comment out these variables:**
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

**Keep these:**
```
DEBUG=False
SECRET_KEY=django-insecure-change-this-to-something-random
ALLOWED_HOSTS=biz-auto.onrender.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://aquamarine-gerbil-514131.hostingersite.com,http://localhost:5173,http://localhost:3000
```

## Step 2: Redeploy

Click **"Manual Deploy"** → **"Deploy latest commit"**

This will use SQLite by default, and the application should work immediately.

## Important Warning

⚠️ **SQLite on Render has limitations:**
- Data will be **lost on every redeploy**
- Not suitable for production
- Only use for testing

## Better Long-Term Solutions

### Option 1: Enable Remote MySQL on Hostinger
Contact Hostinger support and ask:
- "Can you enable remote MySQL access for my database?"
- "What IP addresses should I whitelist for external connections?"

### Option 2: Use Render PostgreSQL
Delete your other Render database and create a new one for this project.

### Option 3: Host Backend on Hostinger
Move the entire backend to Hostinger so it can access the local MySQL database.

## For Now

Use SQLite to test that everything else works, then we can solve the database issue properly.
