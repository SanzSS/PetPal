from django.contrib import admin
from .models import Comment, Review

# Register your models here.

admin.site.register(Comment)
admin.site.register(Review)