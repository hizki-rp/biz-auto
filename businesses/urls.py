from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet, SubmissionViewSet

router = DefaultRouter()
router.register(r'list', BusinessViewSet, basename='business')
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
]
