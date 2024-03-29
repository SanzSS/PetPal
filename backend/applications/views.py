from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED, HTTP_404_NOT_FOUND
from rest_framework.serializers import ValidationError

from .models import Application, PetListing
from .serializers import CreateApplicationSerializer, UpdateApplicationSerializer, ApplicationSerializer, ListApplicationSerializer
from .pagination import ApplicationPagination

# Create your views here.

class ApplicationsCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateApplicationSerializer

    def get_object(self):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        user = self.request.user
        app = Application.objects.get(user=user, pet=pet)
        return app

    def perform_create(self, serializer):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        serializer.save(user=self.request.user, date=timezone.now(), pet=pet)

    def post(self, request, *args, **kwargs):
        petlisting_id = self.kwargs.get('petlisting_id')
        pet = get_object_or_404(PetListing, id=petlisting_id)
        if pet.status != "available":
            return Response({"message": "Pet is not available for application."}, status=HTTP_403_FORBIDDEN)
        if request.user.user_type == 'shelter':
            return Response({"message": "Shelters are not allowed to apply for pets."}, status=HTTP_403_FORBIDDEN)
        try:
            self.get_object()
            return Response({"message": "You have already applied for this pet."}, status=HTTP_403_FORBIDDEN)
        except Application.DoesNotExist:
            pass
        return super().post(request, *args, **kwargs)


class ApplicationsUpdateGetView(UpdateAPIView, RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ApplicationSerializer
        elif self.request.method == 'PATCH':
            return UpdateApplicationSerializer
    
    def get_object(self):
        application_id = self.kwargs.get('application_id')
        app = get_object_or_404(Application, id=application_id)
        return app
    
    def perform_update(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def get(self, request, *args, **kwargs):
        user = request.user
        app = self.get_object()
        if user != app.user and user != app.pet.shelter:
            return Response({"message": "Only the seeker who applied for this pet and the shelter of the pet may see this application."},
                            status=HTTP_403_FORBIDDEN)
        return super().get(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        user = request.user
        app = self.get_object()
        if user != app.user and user != app.pet.shelter:
            return Response({"message": "Only the seeker who applied for this pet and the shelter of the pet may update this application."},
                            status=HTTP_403_FORBIDDEN)
        return super().patch(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method Not Allowed.'}, status=HTTP_405_METHOD_NOT_ALLOWED)
    

class ApplicationsListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListApplicationSerializer
    pagination_class = ApplicationPagination


    def get_queryset(self):
        user = self.request.user

        if user.user_type == 'seeker':
            # seeker can see all of their applications
            apps = Application.objects.filter(user=user)
        else:
            # shelter can see applications for all of their pets
            pets_owned = PetListing.objects.filter(shelter=user)
            apps = Application.objects.filter(pet__in=pets_owned)

        filter = self.request.query_params.get('filter', None)
        sort = self.request.query_params.get('sort', 'create_time')  # Default to 'create_time'

        filter_errors = []
        sort_errors = []
        if filter and filter not in [choice.value for choice in Application.Status]:
            filter_errors.append(f"'{filter}' is not a valid status.")
        if sort not in ['create_time', 'update_time']:
            sort_errors.append(f"'{sort}' should be either 'create_time' or 'update_time'.")

        errors = {}
        if filter_errors:
            errors["filter"] = filter_errors
        if sort_errors:
            errors["sort"] = sort_errors
        
        if errors:
            raise ValidationError(errors)
        
        status_choices = [status.value for status in Application.Status]
        if filter and filter in status_choices:
            apps = apps.filter(status=filter)

        if sort == 'update_time':
            apps = apps.order_by('-last_update')
        else:
            apps = apps.order_by('-date')
        return apps
    