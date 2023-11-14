from django.http import JsonResponse
from django.shortcuts import render, get_list_or_404, get_object_or_404

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Comment, Review
from .paginanation import CommentPagination
from .serializers import CommentSerializer, ReviewSerializer

# Create your views here.
class ApplicationView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    pagination_class = CommentPagination
    
    # want to get first 10 comments on an application
    def get_queryset(self):
        # get the application
        application_id = self.kwargs['application_id']
        start = self.kwargs['start']
        comments_queryset = get_list_or_404(Comment, application_id=application_id)

        sample_comment = comments_queryset[0]

        # if there aren't 4 left after start
        if start + 5 > len(comments_queryset):
            return comments_queryset[start:]
        else:
            end = start + 5
            return comments_queryset[start:end]


class ShelterView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    pagination_class = CommentPagination
    
    # want to get all comments on a shelter
    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']
        start = self.kwargs['start']
        
        review_queryset = get_list_or_404(Review, shelter_id=shelter_id).order_by("-creation_date")

        # if there aren't 4 left after start
        if start + 5 > len(review_queryset):
            return review_queryset[start:]
        else:
            end = start + 5
            return review_queryset[start:end]
        # [0, 1, 2, 3, 4]
    
# helper function to detect if the client has permission to edit or view the application
class ApplicationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        application_id = self.kwargs['application_id']
        comments_queryset = get_list_or_404(Comment, application_id=application_id)

        application = comments_queryset[0].application
        applicant = application.user

        shelter = application.pet.shelter 

        if self.request.user != applicant and self.request.user != shelter:
            raise PermissionDenied("You do not have permission to create this object.")

        return True