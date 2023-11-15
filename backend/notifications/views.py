from django.http import HttpResponse
from django.shortcuts import render

from django.views.generic import UpdateView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import Notification
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from rest_framework.response import Response
from .serializers import NotificationSerializer
from rest_framework.views import APIView



# Create your views here.

class UpdateNotif(UpdateView):
    model = Notification

    def get(self, request, *args, **kwargs):
        if not self.request.user.is_authenticated:
            return HttpResponse(status=401)
        notif = self.get_object()
        notif.state = True
        notif.save()
        content = notif.content
        if notif.content_type.model == 'comment':
            return reverse_lazy('application', kwargs={'application_id':
                                                           content.comments,
                                                       'start': 0})
        if notif.content_type.model == 'review':
            return reverse_lazy('shelter',
                                kwargs={'shelter_id': content.reviews,
                                        'start': 0})

    def get_object(self, queryset=None):
        key1 = self.request.user.pk
        key2 = self.kwargs.get('notif_id')
        notif = get_object_or_404(Notification, receiver=key1, pk=key2)
        return notif

class NotifList(APIView):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(receiver=self.request.user.pk).order_by('-creation_date')
        return queryset

    def get(self, request, format=None):
        if request.user.is_authenticated:
            queryset = self.get_queryset()

            paginator = PageNumberPagination()
            page = paginator.paginate_queryset(queryset, request)

            if page is not None:
                serializer = NotificationSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            else:
                serializer = NotificationSerializer(queryset, many=True)
                return Response(serializer.data)

        else:
            return Response({
                                "detail": "You do not have permission to view these notifications."},
                            status=status.HTTP_403_FORBIDDEN)

class FilterUnread(NotifList):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(
            receiver=self.request.user.pk, state=False).order_by('-creation_date')
        return queryset



class FilterRead(NotifList):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(
            receiver=self.request.user.pk, state=True).order_by(
            '-creation_date')
        return queryset
