# Deployment Guide - Render with PostgreSQL

## Prerequisites
- GitHub account
- Render account (free tier available)
- Push your code to GitHub

## Step 1: Prepare Your Repository

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Backend web service
   - Frontend static site

### Option B: Manual Setup

#### 2.1 Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Name: `business-platform-db`
3. Database: `business_platform`
4. User: `business_platform_user`
5. Region: Choose closest to you
6. Plan: **Free**
7. Click **"Create Database"**
8. Copy the **Internal Database URL** (starts with `postgresql://`)

#### 2.2 Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `business-platform-backend`
   - **Root Directory:** Leave empty
   - **Environment:** `Python 3`
   - **Build Command:** `./backend/build.sh`
   - **Start Command:** `cd backend && gunicorn config.wsgi:application`
   - **Plan:** Free

4. **Environment Variables:**
   ```
   PYTHON_VERSION=3.11.0
   DATABASE_URL=[paste Internal Database URL from step 2.1]
   SECRET_KEY=[generate random string]
   DEBUG=False
   ALLOWED_HOSTS=your-backend-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-name.onrender.com
   ```

5. Click **"Create Web Service"**

#### 2.3 Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `business-platform-frontend`
   - **Root Directory:** Leave empty
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

5. **Add Rewrite Rule** (for React Router):
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

6. Click **"Create Static Site"**

## Step 3: Update CORS Settings

After deployment, update backend environment variables:

1. Go to your backend service on Render
2. Navigate to **Environment** tab
3. Update:
   ```
   ALLOWED_HOSTS=your-backend-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend-name.onrender.com
   ```
4. Save changes (service will redeploy)

## Step 4: Make build.sh Executable

If you get permission errors, run locally:
```bash
chmod +x backend/build.sh
git add backend/build.sh
git commit -m "Make build script executable"
git push
```

## Step 5: Access Your Application

- **Frontend:** `https://your-frontend-name.onrender.com`
- **Backend API:** `https://your-backend-name.onrender.com/api`
- **Admin Panel:** `https://your-backend-name.onrender.com/admin`

## Step 6: Create Admin User

1. Go to Render Dashboard → Your Backend Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```
4. Follow prompts to create admin account

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database has 90-day expiration (backup your data!)

### Database Backups
```bash
# Download backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Monitoring
- Check logs in Render Dashboard → Service → Logs
- Monitor database usage in Database → Metrics

### Custom Domain (Optional)
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed
4. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

## Troubleshooting

### Build Fails
- Check `build.sh` has execute permissions
- Verify all dependencies in `requirements.txt`
- Check Python version matches

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database is in same region as backend
- Use Internal Database URL, not External

### CORS Errors
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Include `https://` in URLs
- No trailing slashes

### Static Files Not Loading
- Run `python manage.py collectstatic` in build script
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify WhiteNoise is installed

## Environment Variables Reference

### Backend Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False`
- `ALLOWED_HOSTS` - Your backend domain
- `CORS_ALLOWED_ORIGINS` - Your frontend domain

### Frontend Required:
- `VITE_API_URL` - Backend API URL

## Updating Your App

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Render automatically redeploys on push
```

## Cost Optimization

Free tier includes:
- 750 hours/month web service
- PostgreSQL database (90 days)
- 100 GB bandwidth
- Automatic SSL certificates

For production, consider upgrading to paid plans for:
- No spin-down
- More resources
- Persistent database
- Priority support

## Support

- [Render Documentation](https://render.com/docs)
- [Django Deployment Guide](https://docs.djangoproject.com/en/5.0/howto/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
