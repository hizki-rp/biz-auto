# Using Hostinger MySQL Database with Render Backend

Since you already have a free database on Render, you can use Hostinger's MySQL database instead.

## Step 1: Create MySQL Database on Hostinger

1. Log in to your Hostinger control panel (hPanel)
2. Go to **"Databases"** → **"MySQL Databases"**
3. Click **"Create New Database"**
4. Fill in:
   - **Database Name**: `biz_auto` (or any name you prefer)
   - **Username**: Create a new user or use existing
   - **Password**: Set a strong password
5. Click **"Create"**
6. **Important**: Note down these details:
   - Database Name
   - Username
   - Password
   - Hostname (usually something like `localhost` or `mysql.hostinger.com`)
   - Port (usually `3306`)

## Step 2: Find Your Database Connection Details

In Hostinger hPanel:
1. Go to **"Databases"** → **"MySQL Databases"**
2. Find your database and click **"Manage"** or **"phpMyAdmin"**
3. Note the connection details shown (hostname, port, etc.)

**Common Hostinger MySQL Hostnames:**
- `localhost` (if backend is on same server)
- `mysql.hostinger.com`
- Or a specific hostname shown in your hPanel

## Step 3: Allow Remote Access (Important!)

Since your backend is on Render (not Hostinger), you need to allow remote connections:

1. In Hostinger hPanel, go to **"Databases"** → **"Remote MySQL"**
2. Add Render's IP addresses or use `%` to allow all (less secure but easier)
3. Or contact Hostinger support to enable remote MySQL access

**Note:** Some Hostinger plans don't allow remote MySQL access. If this is the case, you have two options:
- Upgrade your Hostinger plan
- Host the backend on Hostinger instead of Render (see alternative below)

## Step 4: Add Environment Variables to Render

Go to your Render dashboard → `biz-auto` service → Environment tab and add:

```
DB_ENGINE=mysql
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_mysql_hostname
DB_PORT=3306
```

**Example:**
```
DB_ENGINE=mysql
DB_NAME=u123456789_bizauto
DB_USER=u123456789_bizuser
DB_PASSWORD=YourStrongPassword123
DB_HOST=mysql.hostinger.com
DB_PORT=3306
```

Also make sure you still have:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=biz-auto.onrender.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://aquamarine-gerbil-514131.hostingersite.com,http://localhost:5173,http://localhost:3000
```

## Step 5: Redeploy on Render

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for deployment (~2-3 minutes)
3. Check logs for migration success:
   ```
   Running migrations:
   Applying businesses.0001_initial... OK
   ```

## Step 6: Test

1. Visit: `https://biz-auto.onrender.com/api/businesses/health/`
2. Should show: `"database": "connected", "tables_exist": true`
3. Try submitting the form from your website

---

## Alternative: Host Backend on Hostinger

If Hostinger doesn't allow remote MySQL access, you can host the entire backend on Hostinger:

### Option A: Use Hostinger's Python Hosting
1. Check if your Hostinger plan supports Python applications
2. Upload backend code via FTP/File Manager
3. Set up virtual environment and install requirements
4. Configure web server (Apache/Nginx) to run Gunicorn

### Option B: Keep Using Render with SQLite (Temporary)

For now, you can keep using SQLite on Render for testing:
1. Remove the `DATABASE_URL` environment variable from Render
2. It will use SQLite by default
3. **Warning**: SQLite data will be lost on each redeploy!
4. This is only for testing, not production

---

## Troubleshooting

### Error: "Can't connect to MySQL server"
- Check if remote MySQL is enabled in Hostinger
- Verify hostname and port are correct
- Check if firewall allows connections

### Error: "Access denied for user"
- Verify username and password are correct
- Check if user has permissions for the database
- In phpMyAdmin, check user privileges

### Error: "Unknown database"
- Verify database name is correct (case-sensitive)
- Check if database was created successfully

### Still Having Issues?
Contact Hostinger support and ask:
1. "Does my plan support remote MySQL connections?"
2. "What hostname should I use for remote MySQL access?"
3. "How do I allow external IP addresses to connect to my MySQL database?"

---

## What I've Updated

✅ Added MySQL support to `requirements-prod.txt`
✅ Updated `settings.py` to support MySQL configuration
✅ Backend now supports PostgreSQL, MySQL, or SQLite

Once you set up the MySQL database and add the environment variables, everything should work!
