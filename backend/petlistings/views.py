from django.shortcuts import render
from .models import PetListing, ListingImage
from accounts.models import User
from .serializers import PetListingSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from .pagination import PetListingPagination
from django.http import HttpResponse
from rest_framework.response import Response

# Create your views here.

class Listing(ListCreateAPIView):
    serializer_class = PetListingSerializer
    pagination_class = PetListingPagination

    def get_queryset(self):
        queryset = PetListing.objects.all()

        status = self.request.query_params.get('status', 'available')
        shelter = self.request.query_params.get('shelter', None)
        species = self.request.query_params.get('species', None)
        age = self.request.query_params.get('age', None)
        gender = self.request.query_params.get('gender', None)
        size = self.request.query_params.get('size', None)

        queryset = queryset.filter(status=status)
        if shelter:
            queryset = queryset.filter(shelter=shelter)
        if species:
            queryset = queryset.filter(species=species)
        if age:
            if age == 'baby':
                queryset = queryset.filter(months_old__gte=0, months_old__lte=11)
            elif age == 'juvenile':
                queryset = queryset.filter(years_old__gte=1, years_old__lte=3)
            elif age == 'adult':
                queryset = queryset.filter(years_old__gte=4, years_old__lte=11)
            elif age == 'senior':
                queryset = queryset.filter(years_old__gte=12)
        if gender:
            queryset = queryset.filter(gender=gender)
        if size:
            if size == '0-20':
                queryset = queryset.filter(size__gte=0, size__lte=20)
            elif size == '20-40':
                queryset = queryset.filter(size__gte=20, size__lte=40)
            elif size == '40-60':
                queryset = queryset.filter(size__gte=40, size__lte=60)
            elif size == '60-up':
                queryset = queryset.filter(size__gte=60)

        sort = []

        sort_by_breed = self.request.query_params.get('sort_by_breed', None)
        sort_by_age = self.request.query_params.get('sort_by_age', None)
        sort_by_size = self.request.query_params.get('sort_by_size', None)
        sort_by_listing_date = self.request.query_params.get('sort_by_listing_date', None)

        if sort_by_breed:
            sort.append('breed')
        if sort_by_age:
            sort.extend(['years_old', 'months_old'])
        if sort_by_size:
            sort.append('size')
        if sort_by_listing_date:
            sort.append('listing_date')

        queryset = queryset.order_by(*sort)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if self.request.user.user_type == 'shelter':
                serializer.validated_data['shelter'] = self.request.user
                if serializer.is_valid():
                    listing = serializer.save()
                    images = self.request.data.getlist('images')
                    for image_data in images:
                        image, _ = ListingImage.objects.get_or_create(listing=listing, image=image_data)
                        listing.images.add(image)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)


class ManageListing(RetrieveUpdateDestroyAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer

    def retrieve(self, request, pk):
        listing = self.get_object()
        images = [image.image.url for image in listing.images.all()]
        data = self.get_serializer(listing).data
        data['images'] = images

        return Response(data)
        
    def put(self, request, pk):
        if self.request.user.is_authenticated:
            listing = get_object_or_404(PetListing, pk=pk)
            shelter = get_object_or_404(User, pk=listing.shelter.id)
            if self.request.user == shelter:
                return super().put(request)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)

    def patch(self, request, pk):
        if self.request.user.is_authenticated:
            listing = get_object_or_404(PetListing, pk=pk)
            shelter = get_object_or_404(User, pk=listing.shelter.id)
            if self.request.user == shelter:
                return super().patch(request)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)
        
    def delete(self, request, pk):
        if self.request.user.is_authenticated:
            listing = get_object_or_404(PetListing, pk=pk)
            shelter = get_object_or_404(User, pk=listing.shelter.id)
            if self.request.user == shelter:
                return super().delete(request)
            else:
                return HttpResponse(status=403)
        else:
            return HttpResponse(status=401)