from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED, HTTP_404_NOT_FOUND

from .models import Application, PetListing
from .serializers import CreateApplicationSerializer, UpdateApplicationSerializer, ApplicationSerializer

# Create your views here.

class ApplicationsView(CreateAPIView, UpdateAPIView, RetrieveAPIView):
    permission_classes = [IsAuthenticated]


    def get_object(self):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        user = self.request.user
        app = Application.objects.get(user=user, pet=pet)
        return app

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateApplicationSerializer
        elif self.request.method == 'PATCH':
            return UpdateApplicationSerializer
        elif self.request.method =='GET':
            return ApplicationSerializer

    def perform_create(self, serializer):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        serializer.save(user=self.request.user, date=timezone.now(), pet=pet)

    def perform_update(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def post(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        # if pet.status != "available":
        #     return Response({"message": "Pet is not available for application."}, status=HTTP_403_FORBIDDEN)
        if request.user.user_type == 'shelter':
            return Response({"message": "Shelters are not allowed to apply for pets."}, status=HTTP_403_FORBIDDEN)
        try:
            self.get_object()
            return Response({"message": "You have already applied for this pet."}, status=HTTP_403_FORBIDDEN)
        except Application.DoesNotExist:
            pass
        return super().post(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        user = request.user
        try:
            Application.objects.get(pet=pet)
        except Application.DoesNotExist:
            return Response({"message": "Not found."},
                            status=HTTP_404_NOT_FOUND)
        try:
            app = Application.objects.get(user=user, pet=pet)
        except Application.DoesNotExist:
            return Response({"message": "Only the seeker who applied for this pet and the shelter of the pet may update this application."},
                            status=HTTP_403_FORBIDDEN)
        if user != app.user and user != app.pet.shelter:
            return Response({"message": "Only the seeker who applied for this pet and the shelter of the pet may update this application."},
                            status=HTTP_403_FORBIDDEN)
        return super().patch(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method Not Allowed.'}, status=HTTP_405_METHOD_NOT_ALLOWED)
