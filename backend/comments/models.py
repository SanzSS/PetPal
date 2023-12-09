from datetime import datetime
from django.db import models
from django.conf import settings
from applications.models import Application

# Create your models here.

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    content = models.TextField()
    creation_date = models.DateTimeField(default=datetime.now)

    application = models.ForeignKey(Application, related_name="comments",
                                    blank=True, null=True, on_delete=models.CASCADE)
    
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.FloatField(default=10)
    creation_date = models.DateTimeField(default=datetime.now)

    shelter = models.ForeignKey(settings.AUTH_USER_MODEL,
                                blank=True, null=True, on_delete=models.CASCADE, related_name='reviews')
    # to allow replies
    parent_review = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
