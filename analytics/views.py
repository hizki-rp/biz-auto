from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from businesses.models import Business, Submission, Task
from insights.models import Insight

class AnalyticsView(APIView):
    def get(self, request):
        businesses = Business.objects.all()
        submissions = Submission.objects.all()
        
        total_time_wasted = Task.objects.aggregate(
            total=Sum('time_spent_hours')
        )['total'] or 0
        
        insights_by_difficulty = Insight.objects.values('difficulty').annotate(
            count=Count('id')
        )
        
        common_pain_points = Task.objects.values('name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_businesses': businesses.count(),
            'total_submissions': submissions.count(),
            'total_time_wasted_hours': total_time_wasted,
            'insights_by_difficulty': list(insights_by_difficulty),
            'common_pain_points': list(common_pain_points),
        })
