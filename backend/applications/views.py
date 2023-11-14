from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED

from .models import Application, PetListing
from .serializers import CreateApplicationSerializer, UpdateApplicationSerializer

# Create your views here.

class ApplicationsView(CreateAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        user = self.request.user
        application = Application.objects.get(user=user, pet=pet)
        return application

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateApplicationSerializer
        elif self.request.method == 'PATCH':
            return UpdateApplicationSerializer
        
    def perform_create(self, serializer):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        serializer.save(user=self.request.user, date=timezone.now(), pet=pet)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def post(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        # if pet.status != "available":
        #     return Response({"message": "Pet is not available for application."}, status=HTTP_403_FORBIDDEN)
        if request.user.user_type == 'shelter':
            return Response({"message": "Shelters are not allowed to apply for pets."}, status=HTTP_403_FORBIDDEN)
        return super().post(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        return super().patch(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method Not Allowed.'}, status=HTTP_405_METHOD_NOT_ALLOWED)
