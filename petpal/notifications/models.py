from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
class Notification(models.Model):

    content = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL)

