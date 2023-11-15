from rest_framework import serializers
from .models import Notification
from django.contrib.contenttypes.models import ContentType

class GenericRelatedField(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return None
        return {
            'type': ContentType.objects.get_for_model(value).model,
        }

class NotificationSerializer(serializers.ModelSerializer):
    content = GenericRelatedField(read_only=True)
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = Notification
        fields = ['content', 'sender', 'receiver', 'state', 'creation_date']
