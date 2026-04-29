from rest_framework import serializers
from .models import Business, Submission, Task, PainPoint

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['submission']

class PainPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PainPoint
        fields = '__all__'
        read_only_fields = ['submission']

class SubmissionSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    pain_points = PainPointSerializer(many=True, read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    
    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']
