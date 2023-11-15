from rest_framework.serializers import ModelSerializer
from .models import PetListing, ListingImage

class ListingImageSerializer(ModelSerializer):
    class Meta:
        model = ListingImage
        fields = '__all__'

class PetListingSerializer(ModelSerializer):
    images = ListingImageSerializer(many=True, required=False)

    class Meta:
        model = PetListing
        fields ='__all__'
        read_only_fields = ['shelter']