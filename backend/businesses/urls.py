from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, SubmissionViewSet, health_check

router = DefaultRouter()
router.register(r'list', BusinessViewSet, basename='business')
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]
