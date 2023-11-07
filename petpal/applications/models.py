from django.db import models
from django.conf import settings

from ..petlistings import PetListing

# Create your models here.

class Application(models.Model):
    date = models.DateTimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                             related_name='applications', 
                             on_delete=models.CASCADE)
    pet = models.ForeignKey(PetListing, on_delete=models.CASCADE)

class ApplicationAnswer(models.Model):
    application = models.ForeignKey(Application, 
                                    on_delete=models.CASCADE, 
                                    related_name="answers")
    question_num = models.IntegerField(blank=False, null=False)
    answer = models.TextField()
    