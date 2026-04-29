# Deploy to Render Free Tier (No Credit Card Required)

## Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `business-platform-db`
   - **Database**: `business_platform`
   - **User**: `business_platform_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free** ✅
4. Click **"Create Database"**
5. Wait for it to be created (1-2 minutes)
6. **Copy the "Internal Database URL"** (you'll need this later)
   - It looks like: `postgresql://user:password@host/database`

## Step 2: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Connect your GitHub repository: `hizki-rp/biz-auto`
4. Configure:
   - **Name**: `business-platform-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     cd backend && pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
     ```
   - **Start Command**: 
     ```bash
     cd backend && gunicorn config.wsgi:application
     ```
   - **Plan**: **Free** ✅

5. **Add Environment Variables** (click "Add Environment Variable"):
   ```
   PYTHON_VERSION=3.11.0
   DATABASE_URL=[paste the Internal Database URL from Step 1]
   SECRET_KEY=your-random-secret-key-here-make-it-long-and-random
   DEBUG=False
   ALLOWED_HOSTS=business-platform-backend.onrender.com
   CORS_ALLOWED_ORIGINS=https://business-platform-frontend.onrender.com
   ```

   **To generate SECRET_KEY**, use this in your terminal:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)

## Step 3: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `hizki-rp/biz-auto`
3. Configure:
   - **Name**: `business-platform-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/dist`
   - **Plan**: **Free** ✅

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://business-platform-backend.onrender.com/api
   ```
   
   ⚠️ **Important**: Replace `business-platform-backend` with your actual backend service name from Step 2

5. Click **"Create Static Site"**
6. Wait for deployment (3-5 minutes)

## Step 4: Add Rewrite Rule for Frontend

1. Go to your frontend service
2. Click **"Redirects/Rewrites"** tab
3. Click **"Add Rule"**
4. Configure:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Click **"Save Changes"**

## Step 5: Update Backend CORS Settings

Now that you know your frontend URL, update the backend:

1. Go to your backend service
2. Click **"Environment"** tab
3. Update these variables with your actual URLs:
   - `ALLOWED_HOSTS`: `your-actual-backend-name.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: `https://your-actual-frontend-name.onrender.com`
4. Click **"Save Changes"**
5. Service will automatically redeploy

## Step 6: Create Admin User

1. Go to your backend service
2. Click **"Shell"** tab (on the right side)
3. Wait for shell to connect
4. Run these commands:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```
5. Follow prompts:
   - Username: (your choice)
   - Email: (your email)
   - Password: (create a strong password)
   - Password (again): (confirm)

## Step 7: Test Your Application

Your app is now live! 🎉

- **Frontend**: `https://business-platform-frontend.onrender.com`
- **Backend API**: `https://business-platform-backend.onrender.com/api`
- **Admin Panel**: `https://business-platform-backend.onrender.com/admin`

(Replace with your actual service names)

## Important Notes About Free Tier

### ⚠️ Limitations:
- Services **spin down after 15 minutes** of inactivity
- First request after spin-down takes **30-60 seconds** to wake up
- Database expires after **90 days** (backup your data!)
- 750 hours/month of runtime
- 100 GB bandwidth/month

### 💡 Tips:
- Keep services active by visiting your site regularly
- Set up a cron job to ping your backend every 10 minutes (optional)
- Backup your database before the 90-day limit

## Troubleshooting

### Build Fails on Backend
**Error**: `Permission denied: backend/build.sh`

**Solution**: The build command doesn't use build.sh on free tier. Use the command provided in Step 2.

### Database Connection Error
**Error**: `could not connect to server`

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. Make sure database and backend are in the same region
3. Use the **Internal Database URL**, not External

### CORS Errors in Browser
**Error**: `Access to fetch at '...' has been blocked by CORS policy`

**Solution**:
1. Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
2. Must include `https://` 
3. No trailing slash
4. Redeploy backend after changing

### Frontend Shows Blank Page
**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Make sure rewrite rule is added (Step 4)
4. Check frontend build logs for errors

### Static Files Not Loading (CSS/JS)
**Solution**:
1. Check backend logs for collectstatic errors
2. Verify WhiteNoise is in requirements.txt
3. Check STATIC_ROOT in settings.py

## Updating Your App

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Render will automatically redeploy both services!

## Monitoring

- Check logs: Service → Logs tab
- View metrics: Service → Metrics tab
- Database usage: Database → Metrics tab

## Backup Database (Important!)

Before 90 days, backup your data:

```bash
# In backend shell
python manage.py dumpdata > backup.json
```

Or use Render's database backup feature (requires paid plan).

## Upgrade to Paid Plan (Optional)

Benefits:
- No spin-down (always active)
- Persistent database (no 90-day limit)
- More resources
- Priority support

Starting at $7/month per service.

## Need Help?

- Check service logs for errors
- Review environment variables
- Verify all URLs are correct
- Test API endpoints directly

---

**Your app is now deployed on Render's free tier! 🚀**
