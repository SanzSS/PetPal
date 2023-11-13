from django.db import models
from accounts.models import User
from datetime import datetime
from django.core.validators import MinValueValidator

# Create your models here.

class PetListing(models.Model):
    class Statuses(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        ADOPTED = 'adopted', 'Adopted'
        PENDING = 'pending', 'Pending'
        WITHDRAWN = 'withdrawn', 'Withdrawn'

    class Genders(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'

    status = models.CharField(max_length=9, choices=Statuses.choices, default=Statuses.AVAILABLE)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=6, choices=Genders.choices)
    species = models.CharField(max_length=255)
    breed = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    size = models.FloatField(validators=[MinValueValidator(0.0)])
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    description = models.TextField(blank=True, null=True)
    behaviour = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    listing_date = models.DateTimeField(default=datetime.now)

class ListingImage(models.Model):
    listing = models.ForeignKey(PetListing, related_name='images', on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='listingimages/')