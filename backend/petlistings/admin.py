from django.contrib import admin
from .models import PetListing, ListingImage

# Register your models here.

admin.site.register(PetListing)
admin.site.register(ListingImage)