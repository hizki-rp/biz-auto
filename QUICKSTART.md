# Quick Start Guide

## Prerequisites
- Python 3.10+
- Node.js 18+

## Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at http://localhost:8000

## Frontend Setup (New Terminal)

```powershell
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start dev server
npm run dev
```

Frontend runs at http://localhost:5173

## Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

## Test the Form
1. Go to http://localhost:5173
2. Fill out the multi-step form
3. Submit your business data
4. View submissions at http://localhost:5173/submissions

That's it! No authentication or database setup required - just fill and submit.
