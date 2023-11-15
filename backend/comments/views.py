from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from django.shortcuts import render, get_list_or_404, get_object_or_404

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from notifications.models import Notification
from applications.models import Application

from .models import Comment, Review
from .paginanation import CommentPagination
from .serializers import CommentSerializer, ReviewSerializer

# Create your views here.

# helper function to detect if the client has permission to edit or view the application
class CommentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        application_id = view.kwargs['application_id']
        comments_queryset = get_list_or_404(Comment, application=application_id)

        application = comments_queryset[0].application
        applicant = application.user
        shelter = application.pet.shelter

        if self.request.user != applicant and self.request.user != shelter:
            raise PermissionDenied("You do not have permission to create this object.")

        return True

class CommentView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, CommentPermission]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    # want to get first 10 comments on an application
    def get_queryset(self):
        # get the application
        application_id = self.kwargs['application_id']
        comments_queryset = get_list_or_404(Comment, application=application_id)

        return comments_queryset.order_by("-creation_date")

    def perform_create(self, serializer):
        new_comment = self.serializer_class.save()

        content_type = ContentType.objects.get_for_model(Comment)

        # figure out who the receiver is
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, id=application_id)
        if self.request.user == application.user:
            receiver = application.pet.shelter
        elif self.request.user == application.pet.shelter:
            receiver = application.user

        Notification.objects.create(content_type=content_type, content_id=new_comment.id,
                                    content=new_comment, sender=self.request.user, receiver=receiver, state=False)


class ReviewView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    pagination_class = CommentPagination

    # want to get all comments on a shelter
    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']

        review_queryset = get_list_or_404(Review, shelter=shelter_id).order_by("-creation_date")

        return review_queryset.order_by("-creation_date")

    def perform_create(self, serializer):
        new_review = self.serializer_class.save()

        content_type = ContentType.objects.get_for_model(Comment)

        # to figure out who to notify
        parent_review_id = self.kwargs.get('parent_review_id', None)

        response = get_object_or_404(Review, parent_review=parent_review_id)

        if response == None:
            receiver = new_review.shelter
        else:
            receiver = response

        Notification.objects.create(content_type=content_type, content_id=new_review.id,
                                    content=new_review, sender=self.request.user, receiver=receiver, state=False)
