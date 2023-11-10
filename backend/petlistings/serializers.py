from rest_framework.serializers import ModelSerializer
from .models import PetListing

class PetListingSerializer(ModelSerializer):
    class Meta:
        model = PetListing
        fields = '__all__'