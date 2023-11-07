from datetime import datetime
from django.db import models
from django.conf import settings
from applications.models import Application

# Create your models here.

class Comment(models.Model):
    # set up choices for whether the comment is on a shelter or an application
    TYPE_CHOICES = [
        ("shelter", "shelter"),
        ("application", "application")
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    content = models.TextField()
    creation_date = models.DateTimeField(default=datetime.now)

    # what the comment is left on
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)

    # if the comment is on an application, then this is null
    shelter = models.ForeignKey(settings.AUTH_USER_MODEL,
                                blank=True, null=True, on_delete=models.CASCADE, related_name='reviews')

    # if the comment is on a shelter, then this is null
    application = models.ForeignKey(Application, related_name="comments",
                                    blank=True, null=True, on_delete=models.CASCADE)
