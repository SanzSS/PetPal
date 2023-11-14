from django.shortcuts import render
from django.utils import timezone
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Application
from .serializers import ApplicationSerializer

# Create your views here.


class ApplicationsCreate(CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        petlisting_id = self.kwargs.get('petlisting_id')
        serializer.save(user=self.request.user, date=timezone.now(), pet=petlisting_id)
