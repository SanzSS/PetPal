from django.db import models
from accounts import Shelter
from datetime import datetime
from django.core.validators import MinValueValidator

# Create your models here.

class PetListing(models.Model):
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=6, choices=(('male', 'Male'), ('female', 'Female')))
    species = models.CharField(max_length=255)
    breed = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    weight = models.FloatField(validators=[MinValueValidator(0.0)])
    shelter = models.ForeignKey(Shelter, on_delete=models.SET_NULL)
    description = models.TextField(blank=True, null=True)
    behaviour = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    creation_date = models.DateTimeField(default=datetime.now)