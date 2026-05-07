# PHP + MySQL Deployment Guide

## Overview

Your Django project has been converted to PHP + MySQL so you can deploy it on your Hostinger plan.

**What Changed:**
- ✅ Backend: Django → PHP
- ✅ Database: SQLite → MySQL (Hostinger)
- ✅ Frontend: React (stays the same)

## Step 1: Create Database Tables

1. Go to Hostinger hPanel
2. Click **Databases** → **Management**
3. Find `u170619435_hostdb` and click **Enter phpMyAdmin**
4. Click the **SQL** tab at the top
5. Open `php-backend/create_tables.sql` from this project
6. Copy ALL the SQL code
7. Paste it into phpMyAdmin and click **Go**
8. You should see 4 tables created: `businesses`, `submissions`, `tasks`, `pain_points`

## Step 2: Test PHP Backend Locally (Optional)

If you have PHP installed on your computer:

```bash
cd php-backend
php -S localhost:8080
```

Then test the API:
- http://localhost:8080/api/businesses.php (should return empty array `{"results":[]}`)
- http://localhost:8080/api/analytics.php (should return zeros)

## Step 3: Upload PHP Backend to Hostinger

### Option A: File Manager (Easiest)
1. Go to Hostinger hPanel → **File Manager**
2. Navigate to `public_html`
3. Create a new folder called `api`
4. Upload all files from `php-backend/api/` to `public_html/api/`
5. Upload `php-backend/config.php` to `public_html/api/` (one level up)

Your structure should look like:
```
public_html/
  api/
    config.php
    businesses.php
    submissions.php
    tasks.php
    pain_points.php
    analytics.php
```

### Option B: FTP
Use FileZilla or any FTP client with your Hostinger credentials.

## Step 4: Update Frontend Configuration

Update `frontend/.env`:
```
VITE_API_URL=https://darkslategrey-dugong-740045.hostingersite.com/api
```

## Step 5: Build and Deploy Frontend

```bash
cd frontend
npm run build
```

Upload the contents of `frontend/dist/` to your Hostinger:
- Either to `public_html/` (main site)
- Or to a subfolder like `public_html/app/`

## Step 6: Test the Live Application

1. Visit your Hostinger site
2. Fill out the business form
3. Submit and check if data appears in the list
4. Click "View Details" to see the full submission

## Troubleshooting

### "CORS Error"
Update `php-backend/config.php` line 6:
```php
header('Access-Control-Allow-Origin: https://darkslategrey-dugong-740045.hostingersite.com');
```

### "Database Connection Failed"
Check that `config.php` has the correct credentials:
```php
define('DB_NAME', 'u170619435_hostdb');
define('DB_USER', 'u170619435_host');
define('DB_PASS', 'Rdplayer@1');
```

### "Table doesn't exist"
Make sure you ran the SQL from `create_tables.sql` in phpMyAdmin.

### Test Individual Endpoints
- https://darkslategrey-dugong-740045.hostingersite.com/api/businesses.php
- https://darkslategrey-dugong-740045.hostingersite.com/api/analytics.php

## What's Next?

Once deployed, you have a fully functional CRUD application with:
- ✅ Mobile-optimized form
- ✅ Business details view
- ✅ Analytics dashboard
- ✅ Persistent MySQL database
- ✅ No authentication (as requested)

All data is stored permanently in your Hostinger MySQL database!
