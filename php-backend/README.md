# Business Problem Discovery Platform - PHP Backend

This is the PHP/MySQL backend for the Business Problem Discovery Platform.

## Setup Instructions

### 1. Database Setup

1. Log in to your Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Use your existing database: `u170619435_hostdb`
4. Click **Enter phpMyAdmin**
5. Click the **SQL** tab
6. Copy and paste the contents of `create_tables.sql`
7. Click **Go** to create all tables

### 2. Local Testing with PHP

If you have PHP installed locally, you can test the backend:

```bash
cd php-backend
php -S localhost:8080
```

Then the API will be available at `http://localhost:8080/api/`

### 3. Deploy to Hostinger

1. Upload the entire `php-backend` folder to your Hostinger `public_html` directory
2. You can rename it to `api` for cleaner URLs
3. Update `config.php` with your database credentials (already set to your Hostinger DB)

### 4. Update Frontend

Update `frontend/.env`:
```
VITE_API_URL=https://darkslategrey-dugong-740045.hostingersite.com/api
```

Or if you renamed the folder:
```
VITE_API_URL=https://darkslategrey-dugong-740045.hostingersite.com/php-backend/api
```

## API Endpoints

### Businesses
- `GET /api/businesses.php` - List all businesses
- `GET /api/businesses.php?id=1` - Get single business with all data
- `POST /api/businesses.php` - Create new business

### Submissions
- `POST /api/submissions.php` - Create new submission

### Tasks
- `POST /api/tasks.php?submission_id=1` - Add task to submission

### Pain Points
- `POST /api/pain_points.php?submission_id=1` - Add pain point to submission

### Analytics
- `GET /api/analytics.php` - Get analytics data

## Database Schema

- **businesses** - Company information
- **submissions** - Workflow submissions linked to businesses
- **tasks** - Repetitive tasks linked to submissions
- **pain_points** - Pain points and inefficiencies linked to submissions

## Security Notes

- All database queries use prepared statements to prevent SQL injection
- CORS is enabled for frontend communication
- For production, update CORS to only allow your specific domain
