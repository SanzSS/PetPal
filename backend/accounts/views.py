from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from .serializers import UserSerializer

# Create your views here.

class AccountsCreate(CreateAPIView):
    serializer_class = UserSerializer
