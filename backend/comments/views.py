from datetime import datetime

from django.conf import settings
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
from accounts.models import User

# Create your views here.

# helper function to detect if the client has permission to edit or view the application
class CommentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        application_id = view.kwargs['application_id']
        application = get_object_or_404(Application, id=application_id)

        applicant = application.user
        shelter = application.pet.shelter

        if view.request.user != applicant and view.request.user != shelter:
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
        test = get_list_or_404(Comment, application=application_id)
        comments_queryset = Comment.objects.filter(application=application_id)

        return comments_queryset.order_by("-creation_date")

    def perform_create(self, serializer):
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, id=application_id)

        # Hm
        serializer.validated_data['user_id'] = self.request.user.id
        serializer.validated_data['application'] = application

        new_comment = serializer.save()

        content_type = ContentType.objects.get_for_model(Comment)

        # make sure the below line works
        application.last_update = datetime.now
        if self.request.user == application.user:
            receiver = application.pet.shelter
        elif self.request.user == application.pet.shelter:
            receiver = application.user

        Notification.objects.create(content_type=content_type, content_id=new_comment.id,
                                    content=new_comment, sender=self.request.user, receiver=receiver, state=False)
        
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ReviewView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    pagination_class = CommentPagination

    # want to get all comments on a shelter
    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']

        test = get_list_or_404(Review, shelter=shelter_id)
        review_queryset = Review.objects.filter(shelter=shelter_id)

        return review_queryset.order_by("-creation_date")

    def perform_create(self, serializer):
        shelter_id = self.kwargs['shelter_id']
        shelter_user = get_object_or_404(User, id=shelter_id)
        # to figure out who to notify
        parent_review_id = self.kwargs.get('parent_review_id', None)

        # Hm
        serializer.validated_data['user_id'] = self.request.user.id
        serializer.validated_data['shelter'] = shelter_user

        if parent_review_id is not None:
            parent_review = Review.objects.get(id=parent_review_id)
            serializer.validated_data['parent_review'] = parent_review
        else:
            parent_review = None

        new_review = serializer.save()

        content_type = ContentType.objects.get_for_model(Review)


        if parent_review is None:
            receiver = new_review.shelter
        else:
            receiver = parent_review.user

        Notification.objects.create(content_type=content_type, content_id=new_review.id,
                                    content=new_review, sender=self.request.user, receiver=receiver, state=False)
