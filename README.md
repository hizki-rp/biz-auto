# Business Problem Discovery & Automation Platform

A mobile-optimized web application for businesses to submit information about their operations, inefficiencies, and repetitive tasks.

## 🚀 Live Demo

- **Frontend**: [Your Render URL]
- **Backend API**: [Your Render URL]/api
- **Admin Panel**: [Your Render URL]/admin

## 📱 Features

- Mobile-first responsive design
- Multi-step form for business data collection
- Track repetitive tasks and time spent
- Identify pain points and inefficiencies
- View all submissions with analytics
- No authentication required - simple form submission

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Deployment**: Render

## 📦 Local Development

### Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

Backend runs at http://localhost:8000

### Frontend Setup

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at http://localhost:5173

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions on Render with PostgreSQL.

### Quick Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml`
4. Set environment variables
5. Deploy!

## 📊 Usage

1. Open the application
2. Fill out the 4-step form:
   - Step 1: Business Profile
   - Step 2: Operations Data
   - Step 3: Repetitive Tasks
   - Step 4: Pain Points
3. Submit the form
4. View all submissions in the dashboard

## 🔧 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://... (optional, uses SQLite if not set)
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 📝 API Endpoints

- `GET/POST /api/businesses/list/` - Business CRUD
- `GET/POST /api/businesses/submissions/` - Submission CRUD
- `POST /api/businesses/submissions/{id}/add_task/` - Add task
- `POST /api/businesses/submissions/{id}/add_pain_point/` - Add pain point
- `GET /api/analytics/` - Analytics data
- `GET /api/insights/` - Insights

## 🔐 Admin Panel

Create a superuser to access the admin panel:

```bash
python manage.py createsuperuser
```

Then visit: http://localhost:8000/admin

## 📱 Mobile Optimization

- Touch-friendly inputs (44px minimum)
- Responsive layouts
- Optimized font sizes
- Prevents zoom on iOS
- PWA-ready
- Smooth scrolling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Support

For issues and questions:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review [QUICKSTART.md](QUICKSTART.md) for local setup
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Email notifications
- [ ] PDF export of submissions
- [ ] Advanced analytics dashboard
- [ ] AI-powered insights
- [ ] Multi-language support
- [ ] Offline mode (PWA)

---

Built with ❤️ for business efficiency
