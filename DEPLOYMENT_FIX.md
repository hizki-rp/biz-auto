# Fix Frontend API Connection Issue

## Problem
The deployed frontend is trying to connect to `localhost:8000` instead of the production backend at `https://biz-auto.onrender.com/api`.

## Solution Steps

### 1. Rebuild Frontend (Windows PowerShell)
```powershell
cd frontend
npm run build
```

This will create a new build in `frontend/dist/` with the correct production API URL.

### 2. Upload to Hostinger
1. Go to your Hostinger file manager
2. Navigate to your website root directory
3. Upload ALL files from `frontend/dist/` folder
4. **Important**: Replace all existing files (delete old ones first if needed)

### 3. Update Backend CORS Settings on Render
1. Go to https://dashboard.render.com
2. Click on your `biz-auto` service
3. Go to "Environment" tab
4. Add or update these environment variables:

**CORS_ALLOWED_ORIGINS**
```
https://aquamarine-gerbil-514131.hostingersite.com,http://localhost:5173,http://localhost:3000
```

**ALLOWED_HOSTS** (verify this exists)
```
biz-auto.onrender.com,localhost,127.0.0.1
```

5. Click "Save Changes" - Render will automatically redeploy (takes ~2 minutes)

### 4. Test
1. Wait for Render to finish redeploying (check the "Events" tab)
2. Visit: https://aquamarine-gerbil-514131.hostingersite.com/
3. Fill out the form and click Submit
4. If there are still issues, open browser console (F12) and share the error messages

## Expected Result
- Form submission should work without errors
- Data should be saved to the backend database
- No CORS errors in browser console

## Current Issue: 500 Internal Server Error
✅ Frontend now connects to production backend
❌ Backend returns 500 error (likely database issue)

See `TROUBLESHOOT_500_ERROR.md` for detailed debugging steps.

## Quick Diagnosis
Visit this health check URL to see database status:
```
https://biz-auto.onrender.com/api/businesses/health/
```

## Most Likely Fix Needed
You probably need to:
1. Create a PostgreSQL database on Render (if not done yet)
2. Add the DATABASE_URL environment variable
3. Redeploy to run migrations

## Troubleshooting
If you still see errors after following these steps:

1. **Check health endpoint**: Visit the URL above to see database status
2. **Check Render logs**: Go to Render dashboard → Logs tab → Try submitting form → Look for error messages
3. **Verify PostgreSQL**: Make sure you have a PostgreSQL database created on Render
4. **Check environment variables**: Ensure DATABASE_URL is set correctly
5. **Clear browser cache**: Ctrl + Shift + Delete (Chrome/Edge)
