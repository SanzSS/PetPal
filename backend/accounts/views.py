from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, get_list_or_404
from .serializers import CreateUserSerializer, UserSerializer, UpdateUserSerializer
from .models import User
from notifications.models import Notification
from petlistings.models import PetListing
from applications.models import Application
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.

# helper function to detect if the client has permission to edit or view the application
class ViewSeeker(permissions.BasePermission):
    def has_permission(self, request, view):
        user_id = view.kwargs['user_id']
        if request.method == 'PATCH' and request.user.pk != user_id:
            return False
        user = get_object_or_404(User, id=user_id)

        if user.user_type == "shelter":
            return True
        # shelter can only view seeker if seeker has an active application w a shelter
        if view.request.user.user_type == "shelter":
            applications = Application.objects.filter(user=user, status=Application.Status.PENDING)
            if applications.exists():
                return True
        return False


class AccountsCreate(CreateAPIView):
    serializer_class = CreateUserSerializer

class ShelterList(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        shelters = User.objects.filter(user_type=User.UserType.SHELTER)
        return shelters


class GetAccount(RetrieveAPIView, UpdateAPIView):
    # serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ViewSeeker]

    def get_object(self):
        user_id = self.kwargs['user_id']
        if self.request.method == 'PATCH':
            return self.request.user
        user = get_object_or_404(User, id=user_id)
        return user
    #
    def delete(self, request, user_id):
        if self.request.user.pk != self.get_object().pk:
            return Response({"detail": "You do not have permission to delete this account."},
                            status=status.HTTP_401_UNAUTHORIZED)
        Notification.objects.filter(receiver=user_id).delete()
        if User.objects.get(pk=user_id).user_type == User.UserType.SHELTER:
            PetListing.objects.filter(shelter=user_id).delete()
        else:
            Application.objects.filter(user=user_id).delete()
        User.objects.get(pk=user_id).delete()
        return Response({"detail": "Account Successfully Deleted."},
                            status=status.HTTP_204_ACCEPTED)
    #
    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return UpdateUserSerializer
        if self.request.method == 'GET':
            return UserSerializer



