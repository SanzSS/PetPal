from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import Comment, Review

# single serializers
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(read_only=True, slug_field='name')

    class Meta:
        model = Comment
        fields = ['user', 'content']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(read_only=True, slug_field='name')

    class Meta:
        model = Review
        fields = ['user', 'content']

# list serializers
# class CommentListSerializer(serializers.ModelSerializer):
#     application = serializers.PrimaryKeyRelatedField(read_only=True)
#     comments = serializers.ListField(child=CommentSerializer())

# class ReviewListSerializer(serializers.ModelSerializer):
#     shelter = serializers.PrimaryKeyRelatedField(read_only=True)
#     comments = serializers.ListField(child=ReviewSerializer())