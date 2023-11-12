from django.shortcuts import render

from django.views.generic import UpdateView, ListView
from .models import Notification
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from rest_framework.response import Response
from .serializers import NotificationSerializer
from rest_framework.views import APIView



# Create your views here.

class UpdateApplicationNotif(UpdateView):
    model = Notification

    def get(self, request, *args, **kwargs):
        notif = self.get_object()
        notif.state = True
        notif.save()
        content = notif.content
        return reverse_lazy('application', kwargs={'application_id': content.comments, })

    def get_object(self, queryset=None):
        key1 = self.kwargs.get('key1')
        key2 = self.kwargs.get('key2')
        notif = get_object_or_404(Notification, receiver=key1, sender=key2)
        return notif

class UpdateShelterNotif(UpdateView):
    model = Notification

    def get(self, request, *args, **kwargs):
        notif = self.get_object()
        notif.state = True
        notif.save()
        content = notif.content
        return reverse_lazy('shelter', kwargs={'shelter_id': content.reviews, })

    def get_object(self, queryset=None):
        key1 = self.kwargs.get('key1')
        key2 = self.kwargs.get('key2')
        notif = get_object_or_404(Notification, receiver=key1, sender=key2)
        return notif

class NotifSeekerList(APIView):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(receiver=self.kwargs.get('seeker_id')).order_by('-creation_date')
        return queryset

    def get(self, request, format=None):
        serializer = NotificationSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class NotifShelterList(APIView):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(receiver=self.kwargs.get('shelter_id')).order_by('-creation_date')
        return queryset

    def get(self, request, format=None):
        serializer = NotificationSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

