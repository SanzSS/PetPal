from django.contrib.contenttypes.fields import GenericRelation
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.conf import settings
# from django.contrib.contenttypes.fields import GenericRelation
from petlistings.models import PetListing
from .constants import NUM_QUESTIONS
from notifications.models import Notification

# Create your models here.

class Application(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             related_name='applications',
                             on_delete=models.CASCADE)
    pet = models.ForeignKey(PetListing, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField(default=0)
    class Status(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        WITHDRAWN = "withdrawn"
        DENIED = "denied"
    status = models.CharField(max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    last_update = models.DateTimeField(auto_now=True)
    # notif = GenericRelation(Notification)

class ApplicationAnswer(models.Model):
    application = models.ForeignKey(Application,
                                    on_delete=models.CASCADE,
                                    related_name="answers")
    question_num = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(NUM_QUESTIONS)],
        blank=False, null=False)
    answer = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['application', 'question_num'], name='unique_question_num_per_application')
        ]
