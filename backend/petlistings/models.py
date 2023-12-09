from django.db import models
from accounts.models import User
from datetime import datetime
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

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
    months_old = models.PositiveIntegerField(validators=[MaxValueValidator(11.0)], null=True, default=0)
    years_old = models.PositiveIntegerField(null=True, default=0)
    size = models.FloatField(validators=[MinValueValidator(0.0)])
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pets")
    description = models.TextField(blank=True, null=True)
    behaviour = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    listing_date = models.DateTimeField(default=datetime.now)

    #def save(self, *args, **kwargs):
    #    if not self.months_old and not self.years_old:
    #        raise ValidationError('At least one of months_old or years_old must be greater than 0.')

    #    super().save(*args, **kwargs)

class ListingImage(models.Model):
    listing = models.ForeignKey(PetListing, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='listingimages/')