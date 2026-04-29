from django.db import models
from businesses.models import Submission

class Insight(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='insights')
    problem_description = models.TextField()
    impact_time_hours = models.FloatField(help_text='Time lost per week in hours')
    impact_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    suggested_solution = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    estimated_time_saved_hours = models.FloatField()
    implementation_steps = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Insight for {self.submission.business.name}"
