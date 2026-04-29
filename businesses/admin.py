from django.contrib import admin
from .models import Business, Submission, Task, PainPoint

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'size', 'location', 'created_at']
    list_filter = ['industry', 'size']
    search_fields = ['name', 'location']

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['business', 'workflow_name', 'status', 'created_at']
    list_filter = ['status']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['name', 'submission', 'frequency', 'time_spent_hours']

@admin.register(PainPoint)
class PainPointAdmin(admin.ModelAdmin):
    list_display = ['title', 'submission', 'severity']
    list_filter = ['severity']
