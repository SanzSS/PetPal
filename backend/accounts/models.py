from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, name, user_type, password=None, **other_fields):
        if not email:
            raise ValueError(("The Email must be set"))
        if not password:
            raise ValueError(("The password must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, user_type=user_type, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, name, user_type, password=None):
        return self.create_user(email,
                                name,
                                user_type,
                                password,
                                is_staff=True,
                                is_superuser=True,
                                is_active=True)

class User(AbstractUser):
    username = None
    email = models.EmailField(verbose_name="email address", unique=True, null=False)
    name = models.CharField(max_length=255, null=False)
    # password = models.password(max_length=200, null=False)
    class UserType(models.TextChoices):
        SHELTER = "shelter"
        SEEKER = "seeker"
    user_type = models.CharField(max_length=255,
        choices=UserType.choices,
        # default=UserType.SEEKER,
    )
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "user_type"]

    objects = UserManager()

    def __str__(self):
        return self.name

@receiver(post_save, sender=User)
def set_default_avatar(sender, instance, created, **kwargs):
    if created and not instance.avatar:
        instance.avatar.name = 'images/default_pfp.jpg'
        instance.save()