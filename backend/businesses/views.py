from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db import connection
from decouple import config
from .models import Business, Submission, Task, PainPoint
from .serializers import BusinessSerializer, SubmissionSerializer, TaskSerializer, PainPointSerializer

@api_view(['GET'])
def health_check(request):
    """Health check endpoint to verify database connectivity"""
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Check if tables exist
        tables_exist = Business._meta.db_table in connection.introspection.table_names()
        
        return Response({
            'status': 'healthy',
            'database': 'connected',
            'tables_exist': tables_exist,
            'debug': config('DEBUG', default=False, cast=bool)
        })
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'error': str(e)
        }, status=500)

class BusinessViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessSerializer
    queryset = Business.objects.all()

class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    queryset = Submission.objects.all()
    
    @action(detail=True, methods=['post'])
    def add_task(self, request, pk=None):
        submission = self.get_object()
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(submission=submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_pain_point(self, request, pk=None):
        submission = self.get_object()
        serializer = PainPointSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(submission=submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
