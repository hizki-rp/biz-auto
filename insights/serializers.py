from rest_framework import serializers
from .models import Insight

class InsightSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='submission.business.name', read_only=True)
    
    class Meta:
        model = Insight
        fields = '__all__'
        read_only_fields = ['created_at']
