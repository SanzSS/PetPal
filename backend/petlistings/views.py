from .models import PetListing, ListingImage
from accounts.models import User
from .serializers import PetListingSerializer, FilterSerializer, ShelterFilterSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from django.shortcuts import get_object_or_404
from .pagination import PetListingPagination
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

# Create your views here.

class Listing(ListCreateAPIView):
    serializer_class = PetListingSerializer
    pagination_class = PetListingPagination

    def get(self, request):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to view pet listings."}, status=status.HTTP_401_UNAUTHORIZED)
        return super().get(request)

    def get_queryset(self):
        queryset = PetListing.objects.all()

        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        status = self.request.query_params.get('status', None)
        shelter = self.request.query_params.get('shelter', None)
        species = self.request.query_params.get('species', None)
        breed = self.request.query_params.get('breed', None)
        age = self.request.query_params.get('age', None)
        gender = self.request.query_params.get('gender', None)
        size = self.request.query_params.get('size', None)

        if status:
            queryset = queryset.filter(status__iexact=status)
        if shelter:
            queryset = queryset.filter(shelter=shelter)
        if species:
            queryset = queryset.filter(species__iexact=species)
        if breed:
            queryset = queryset.filter(breed__iexact=breed)
        if age:
            if age == 'baby':
                queryset = queryset.filter(months_old__gte=0, months_old__lte=11).filter(Q(years_old=0) | Q(years_old__isnull=True))
            elif age == 'juvenile':
                queryset = queryset.filter(years_old__gte=1, years_old__lte=3)
            elif age == 'adult':
                queryset = queryset.filter(years_old__gte=4, years_old__lte=11)
            elif age == 'senior':
                queryset = queryset.filter(years_old__gte=12)
        if gender:
            queryset = queryset.filter(gender__iexact=gender)
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
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to create listings."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.user_type != 'shelter':
            return Response({"detail": "You do not have permission to create listings."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer.validated_data['shelter'] = self.request.user
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        listing = serializer.save()
        
        images = self.request.FILES.getlist('images')

        for image_data in images:
            image, _ = ListingImage.objects.get_or_create(listing=listing, image=image_data)
            listing.images.add(image)


class Filters(ListAPIView):
    serializer_class = FilterSerializer
    queryset = PetListing.objects.values('species', 'breed').distinct()
    pagination_class = None

    def get(self, request):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to view pet listings."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(self.get_queryset(), many=True)
        species_list = {item['species'].lower() for item in serializer.data}
        breed_list = {item['breed'].lower() for item in serializer.data}
        return Response({'species': list(species_list), 'breeds': list(breed_list)})
    
class ShelterFilters(ListAPIView):
    serializer_class = ShelterFilterSerializer
    queryset = User.objects.values('name', 'id').distinct().filter(user_type='shelter')
    pagination_class = None

    def get(self, request):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to view users."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(self.get_queryset(), many=True)
        shelter_ids = [item['id'] for item in serializer.data]
        shelter_names = [item['name'] for item in serializer.data]
        return Response({'shelter_ids': shelter_ids, 'shelter_names': shelter_names})


class ManageListing(RetrieveUpdateDestroyAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer

    def retrieve(self, request, pk):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to view pet listings."}, status=status.HTTP_401_UNAUTHORIZED)
        
        listing = self.get_object()
        images = [image.image.url for image in listing.images.all()]
        data = self.get_serializer(listing).data
        data['images'] = images

        return Response(data)
        
    def put(self, request, pk):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to edit your pet listing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.user_type != 'shelter':
            return Response({"detail": "You cannot edit pet listings."}, status=status.HTTP_403_FORBIDDEN)

        listing = get_object_or_404(PetListing, pk=pk)
        shelter = get_object_or_404(User, pk=listing.shelter.id)
        if self.request.user != shelter:
            return Response({"detail": "You cannot edit another shelter's pet listing."}, status=status.HTTP_403_FORBIDDEN)
        
        if not self.request.data:
            return Response({"detail": "No data provided for update."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PetListingSerializer(listing, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        listing = serializer.save()
        images = self.request.FILES.getlist('images')
        if images:
            old_images = listing.images.all()
            for image in old_images:
                image.delete()
            for image_data in images:
                image, _ = ListingImage.objects.get_or_create(listing=listing, image=image_data)
                listing.images.add(image)
            listing.save()
        return super().put(request)
            

    def patch(self, request, pk):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to edit your pet listing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.user_type != 'shelter':
            return Response({"detail": "You cannot edit pet listings."}, status=status.HTTP_403_FORBIDDEN)
        
        listing = get_object_or_404(PetListing, pk=pk)
        shelter = get_object_or_404(User, pk=listing.shelter.id)
        if self.request.user != shelter:
            return Response({"detail": "You cannot edit another shelter's pet listing."}, status=status.HTTP_403_FORBIDDEN)

        if not self.request.data:
            return Response({"detail": "No data provided for update."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PetListingSerializer(listing, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        listing = serializer.save()
        images = self.request.FILES.getlist('images')
        if images:
            old_images = listing.images.all()
            for image in old_images:
                image.delete()
            for image_data in images:
                image, _ = ListingImage.objects.get_or_create(listing=listing, image=image_data)
                listing.images.add(image)
            listing.save()
        return super().patch(request)
            
        
    def destroy(self, request, pk):
        if not self.request.user.is_authenticated:
            return Response({"detail": "You must be logged in to delete your pet listing."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if self.request.user.user_type != 'shelter':
            return Response({"detail": "You cannot delete pet listings."}, status=status.HTTP_403_FORBIDDEN)
        
        listing = get_object_or_404(PetListing, pk=pk)
        shelter = get_object_or_404(User, pk=listing.shelter.id)
        if self.request.user == shelter:
            return super().destroy(request)
        else:
            return Response({"detail": "You cannot delete another shelter's pet listing."}, status=status.HTTP_403_FORBIDDEN)
            
        
    def perform_destroy(self, instance):
        old_images = instance.images.all()
        for image in old_images:
            image.delete()
        return super().perform_destroy(instance)
        