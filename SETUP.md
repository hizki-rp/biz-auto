# Setup Guide

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- pip and npm

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create .env file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Create PostgreSQL database:
```bash
createdb business_platform
```

6. Run migrations:
```bash
python manage.py migrate
```

7. Create superuser:
```bash
python manage.py createsuperuser
```

8. Start development server:
```bash
python manage.py runserver
```

Backend will be available at http://localhost:8000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## Testing the Application

1. Open http://localhost:5173
2. Register a new account
3. Login with your credentials
4. Create a new business
5. Submit workflow data
6. View insights and analytics

## API Documentation

Once the backend is running, visit:
- Admin panel: http://localhost:8000/admin
- API endpoints: http://localhost:8000/api/

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists

### Frontend Build Issues
- Clear node_modules and reinstall
- Check Node.js version (18+)
- Verify all dependencies installed

### CORS Issues
- Ensure frontend URL is in CORS_ALLOWED_ORIGINS in settings.py
- Check API_URL in frontend .env
