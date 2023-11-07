from django.contrib import admin
from .models import Application, ApplicationAnswer

# Register your models here.

admin.site.register(Application, ApplicationAnswer)

