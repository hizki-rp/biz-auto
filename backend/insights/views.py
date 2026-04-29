from rest_framework import viewsets
from .models import Insight
from .serializers import InsightSerializer

class InsightViewSet(viewsets.ModelViewSet):
    serializer_class = InsightSerializer
    queryset = Insight.objects.all()
