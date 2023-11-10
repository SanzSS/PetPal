from django.shortcuts import render
from .models import PetListing
from accounts.models import User
from .serializers import PetListingSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class Listing(ListCreateAPIView):
    serializer_class = PetListingSerializer

    def get_queryset(self):
        queryset = PetListing.objects.all()

        status = self.request.query_params.get('status', 'available')
        shelter_id = self.request.query_params.get('shelter', None)
        species = self.request.query_params.get('species', None)
        age = self.request.query_params.get('age', None)
        gender = self.request.query_params.get('gender', None)
        size = self.request.query_params.get('size', None)

        #queryset = queryset.filter(status=status)
        if shelter_id:
            queryset = queryset.filter(shelter=shelter_id)
        if species:
            queryset = queryset.filter(species=species)
        if age:
            queryset = queryset.filter(age=age)
        if gender:
            queryset = queryset.filter(gender=gender)
        if size:
            queryset = queryset.filter(size=size)

        sort_by = self.request.query_params.get('sort', None)

        allowed_sort_fields = ['breed', 'age', 'size', 'creation_date']

        if sort_by in allowed_sort_fields:
            queryset = queryset.order_by(sort_by)

        return queryset

    def perform_create(self, serializer):
        shelter = get_object_or_404(User, pk=self.kwargs['pk'])
        serializer.save(shelter=shelter)


class ManageListing(RetrieveUpdateDestroyAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer

    def get_permissions(self):
        if self.request.method in ['PUT',  'DELETE']:
            return [IsAuthenticated()]
        else:
            return [AllowAny()]