from django.http import HttpResponse
from django.shortcuts import redirect

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from rest_framework.response import Response
from .serializers import NotificationSerializer
from rest_framework.views import APIView



# Create your views here.

class UpdateNotif(APIView):
    model = Notification
    permission_classes = [IsAuthenticated]


    def get(self, request, notif_id):
        notif = self.get_object()
        notif.state = True
        notif.save()
        content = notif.content
        print(notif.content_type.model)
        if notif.content_type.model == 'comment':
            return redirect(reverse_lazy('comments:application', kwargs={'application_id':
                                                           content.application.pk
                                                       }))
        if notif.content_type.model == 'review':
            return redirect(reverse_lazy('comments:shelter',
                                kwargs={'shelter_id': content.shelter.pk}))
        if notif.content_type.model == 'application':
            return redirect(reverse_lazy('applications:application',
                                kwargs={'petlisting_id': content.pet.pk,
                                        }))

    def get_object(self, queryset=None):
        key1 = self.request.user.pk
        key2 = self.kwargs.get('notif_id')
        notif = get_object_or_404(Notification, receiver=key1, pk=key2)
        return notif

class NotifList(APIView):
    model = Notification
    def get_queryset(self):
        queryset = Notification.objects.filter(receiver=self.request.user.pk)
        filter = self.request.query_params.get('filter', None)
        sort = self.request.query_params.get('sort',
                                             None)  # Default to 'create_time'
        filter_errors = []
        sort_errors = []
        if filter and filter not in ['read', 'unread']:
            filter_errors.append(f"'{filter}' is not a valid status.")
        if sort and sort not in ['create_time', 'update_time']:
            sort_errors.append(
                f"'{sort}' should be 'create_time'.")

        errors = {}
        if filter_errors:
            errors["filter"] = filter_errors
        if sort_errors:
            errors["sort"] = sort_errors

        if errors:
            raise ValidationError(errors)

        if filter == 'read':
            queryset = queryset.filter(state=True)
        elif filter == 'unread':
            queryset = queryset.filter(state=False)

        if sort == 'create_time':
            queryset = queryset.order_by('-creation_date')
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
                            status=status.HTTP_401_UNAUTHORIZED)

class Delete(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Notification, pk=self.kwargs.get('notif_id'))

    def get(self, request, notif_id):
        user = self.request.user
        receiver = self.get_object().receiver
        if user.pk != receiver.pk:
            return Response({
                                "detail": "You do not have permission to delete this notification."},
                            status=status.HTTP_401_UNAUTHORIZED)
        Notification.objects.filter(receiver=receiver).delete()
        return Response({
                                "detail": "Notification Successfully Deleted."},
                            status=status.HTTP_202_ACCEPTED)
