from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import (CharField, ModelSerializer,
                                        ValidationError)
from .models import User
from comments.serializers import ReviewSerializer
from applications.serializers import PetListingSerializer


class CreateUserSerializer(ModelSerializer):
    password1 = CharField(write_only=True, style={"input_type": "password"})
    password2 = CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = get_user_model()
        fields = ["email", "name", "password1", "password2", "user_type", "avatar"]
        extra_kwargs = {"password1": {"write_only": True}}

    def validate_password1(self, value):
        password = self.context["request"].data.get("password1")
        try:
            validate_password(password)
        except ValidationError as e:
            error_messages = {"password": []}
            for error in e.error_list:
                error_messages["password"].append(f"{error.message} ({error.code})")

            raise ValidationError(error_messages)
        
        return password

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2", None)
        user = get_user_model().objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password1"],
            user_type=validated_data["user_type"],
            avatar=validated_data.get("avatar")
        )
        return user


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'user_type', 'avatar']

class ShelterSerializer(ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    pets = PetListingSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'avatar', 'reviews', 'pets']

class UpdateUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)

        if password:
            instance.set_password(password)
            instance.save()

        return instance
