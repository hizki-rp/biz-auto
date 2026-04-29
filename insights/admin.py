from django.contrib import admin
from .models import Insight

@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ['submission', 'difficulty', 'impact_time_hours', 'estimated_time_saved_hours', 'created_at']
    list_filter = ['difficulty', 'created_at']
