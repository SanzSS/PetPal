from django.conf import settings

from rest_framework import serializers

from ..bonus_feature.models import Keyword

# single serializers
class KeywordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Keyword
        fields = ['id', 'keyword', 'weight']