# Push to GitHub and Deploy to Render

## Step 1: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Business Platform ready for deployment"

# Rename branch to main
git branch -M main
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `business-platform` (or your preferred name)
3. Description: "Business Problem Discovery & Automation Platform"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 3: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote (replace YOUR_USERNAME and YOUR_REPO with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/business-platform.git
git push -u origin main
```

## Step 4: Deploy to Render

### Option A: Using Blueprint (Automatic - Recommended)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Click **"Connect GitHub"** (if not already connected)
4. Select your repository: `YOUR_USERNAME/YOUR_REPO`
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**
7. Wait for deployment (5-10 minutes)

### Option B: Manual Deployment

If Blueprint doesn't work, follow the manual steps in DEPLOYMENT.md

## Step 5: Configure Environment Variables

After deployment, update these in Render Dashboard:

### Backend Service:
1. Go to your backend service
2. Click **"Environment"** tab
3. Update these variables:
   - `ALLOWED_HOSTS`: Add your backend URL (e.g., `your-backend.onrender.com`)
   - `CORS_ALLOWED_ORIGINS`: Add your frontend URL (e.g., `https://your-frontend.onrender.com`)

### Frontend Service:
1. Go to your frontend service
2. Click **"Environment"** tab
3. Update:
   - `VITE_API_URL`: Set to your backend URL (e.g., `https://your-backend.onrender.com/api`)

## Step 6: Redeploy Services

After updating environment variables:
1. Go to each service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Step 7: Create Admin User

1. Go to your backend service on Render
2. Click **"Shell"** tab
3. Run:
```bash
cd backend
python manage.py createsuperuser
```
4. Follow prompts to create admin account

## Step 8: Test Your Application

Visit your frontend URL: `https://your-frontend.onrender.com`

## Troubleshooting

### "Blueprint file not found"
- Make sure `render.yaml` is in the root directory (not in a subfolder)
- Ensure you pushed all files: `git push -u origin main`
- Check the branch is named `main` (not `master`)

### Build Fails
- Check logs in Render Dashboard
- Verify `backend/build.sh` has execute permissions
- Make sure all files are committed and pushed

### Database Connection Error
- Verify `DATABASE_URL` is set automatically by Render
- Check database is in the same region as backend

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` with your actual frontend URL
- Include `https://` in the URL
- No trailing slashes

### Static Files Not Loading
- Check build logs for errors
- Verify `npm run build` completes successfully
- Check `frontend/dist` folder is created

## Quick Commands Reference

```bash
# Check git status
git status

# Add new changes
git add .
git commit -m "Your commit message"
git push

# View remote URL
git remote -v

# Check current branch
git branch
```

## Need Help?

- Check DEPLOYMENT.md for detailed instructions
- Review Render logs for error messages
- Verify all environment variables are set correctly

## Expected URLs After Deployment

- **Frontend**: `https://business-platform-frontend.onrender.com`
- **Backend API**: `https://business-platform-backend.onrender.com/api`
- **Admin Panel**: `https://business-platform-backend.onrender.com/admin`

(Your actual URLs will be different based on your service names)
