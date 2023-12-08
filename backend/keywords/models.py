from django.db import models

from petlistings.models import PetListing

# Create your models here.
class Keyword(models.Model):
    keyword = models.TextField()
    weight = models.FloatField()
    petlisting = models.ForeignKey(PetListing, related_name="keywords", blank=False, null=False, on_delete=models.CASCADE)