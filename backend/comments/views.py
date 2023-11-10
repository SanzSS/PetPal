from django.shortcuts import render, get_list_or_404

from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Comment, Review
from .serializers import CommentSerializer, CommentListSerializer, ReviewSerializer, ReviewListSerializer

# Create your views here.
class ApplicationView(ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return CommentSerializer
        else:
            return CommentListSerializer
    
    # want to get all comments on an application
    def get_queryset(self):
        application_id = self.kwargs['application_id']
        application_comments = get_list_or_404(Comment, application_id=application_id)
        return application_comments

class ShelterView(ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return ReviewSerializer
        else:
            return ReviewListSerializer
    
    # want to get all comments on a shelter
    def get_queryset(self):
        shelter_id = self.kwargs['shelter_id']
        shelter_views = get_list_or_404(Review, shelter_id=shelter_id)
        return shelter_views