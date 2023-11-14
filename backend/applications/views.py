from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Application, PetListing
from .serializers import ApplicationSerializer

# Create your views here.


class ApplicationsCreate(CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        petlisting_id = self.kwargs.get('petlisting_id')
        serializer.save(user=self.request.user, date=timezone.now(), pet=petlisting_id)
