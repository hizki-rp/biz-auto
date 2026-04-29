from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/businesses/', include('businesses.urls')),
    path('api/insights/', include('insights.urls')),
    path('api/analytics/', include('analytics.urls')),
]
