from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from .serializers import CreateUserSerializer, UserSerializer, UpdateUserSerializer
from .models import User
from notifications.models import Notification
from petlistings.models import PetListing
from applications.models import Application
from rest_framework.permissions import IsAuthenticated
# Create your views here.


class AccountsCreate(CreateAPIView):
    serializer_class = CreateUserSerializer

class ShelterList(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        shelters = User.objects.filter(user_type=User.UserType.SHELTER)
        return shelters

class UpdateAccount(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

def delete(request, shelter_id):
    user = request.user
    if user.pk != shelter_id or not user.is_authenticated:
        return HttpResponse(status=401)
    Notification.objects.filter(receiver=shelter_id).delete()
    Notification.save()
    if User.objects.get(pk=shelter_id).user_type == User.UserType.SHELTER:
        PetListing.objects.filter(shelter=shelter_id).delete()
        PetListing.save()
    else:
        Application.objects.filter(user=shelter_id).delete()
        Application.save()
    User.objects.get(pk=shelter_id).delete()
    User.save()
    return HttpResponse(status=204)

class GetAccount(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(User, id=user_id)
        
        # anyone can view a shelter
        if user.user_type == "shelter":
            return user
        # shelter can only view seeker if seeker has an active application w a shelter
        if self.request.user.user_type == "shelter":
            applications = Application.objects.filter(user=user, status=Application.Status.PENDING)
            if applications.exists():
                return user
            return HttpResponse(status=403)

        return HttpResponse(status=403)

