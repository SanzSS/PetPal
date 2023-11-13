from django.shortcuts import render
from rest_framework.generics import CreateAPIView

from .serializers import CreateUserSerializer

# Create your views here.


class AccountsCreate(CreateAPIView):
    serializer_class = CreateUserSerializer
