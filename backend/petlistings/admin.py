from django.contrib import admin

from .models import PetListing, ListingImage

from .models import PetListing

# Register your models here.

admin.site.register(PetListing)
admin.site.register(ListingImage)
