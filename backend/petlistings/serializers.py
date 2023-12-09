from rest_framework.serializers import ModelSerializer
from .models import PetListing, ListingImage
from rest_framework import serializers
from accounts.models import User

class ListingImageSerializer(ModelSerializer):
    class Meta:
        model = ListingImage
        fields = '__all__'

class PetListingSerializer(ModelSerializer):
    images = ListingImageSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = PetListing
        fields ='__all__'
        read_only_fields = ['shelter']

    def create(self, validated_data):
        months_old = validated_data.get('months_old', 0)
        years_old = validated_data.get('years_old', 0)

        if (months_old == 0 and years_old == 0) or (months_old is None and years_old is None):
            raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')
        elif (months_old == 0 and years_old is None) or (months_old is None and years_old == 0):
            raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')
        elif months_old is None or years_old is None or months_old < 0 or years_old < 0:
            raise serializers.ValidationError('Age must be positive.')

        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        print(validated_data)
        if 'months_old' in validated_data.keys() or 'years_old' in validated_data.keys():
            months_old = validated_data.get('months_old', None)
            years_old = validated_data.get('years_old', None)
            prev_months = instance.months_old
            prev_years = instance.years_old

            if (months_old == 0 and years_old == 0) or (months_old is None and years_old is None):
                raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')
            elif (months_old == 0 and years_old is None) or (months_old is None and years_old == 0):
                raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')
            elif months_old is None or years_old is None or months_old < 0 or years_old < 0:
                raise serializers.ValidationError('Age must be positive.')
            elif years_old is None and months_old == 0 and prev_years == 0:
                raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')
            elif months_old is None and years_old == 0 and prev_months == 0:
                raise serializers.ValidationError('At least one of months_old or years_old must be greater than 0.')        

        return super().update(instance, validated_data)
    
class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['species', 'breed']