from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import (CharField, ChoiceField, DateTimeField, IntegerField, ModelSerializer,
                                        Serializer, ValidationError)
from .models import Application, ApplicationAnswer
from .constants import APPLICATION_QUESTIONS
from notifications.models import Notification
from django.shortcuts import get_object_or_404
from petlistings.models import PetListing
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED, HTTP_404_NOT_FOUND


class UserSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "email", "name", "user_type", "avatar"]

class PetListingSerializer(ModelSerializer):
    class Meta:
        model = PetListing
        fields = ["id",
                  "name",
                  "status",
                  "gender",
                  "species",
                  "breed",
                  "months_old",
                  "years_old"]

class ApplicationAnswerSerializer(ModelSerializer):
    # question = CharField()

    class Meta:
        model = ApplicationAnswer
        fields = ['question_num', 'answer']

class ApplicationSerializer(ModelSerializer):
    answers = ApplicationAnswerSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    pet = PetListingSerializer(read_only=True)
    date = DateTimeField(read_only=True)
    status = CharField(read_only=True)

    class Meta:
        model = Application
        fields = ['date', 'pet', 'status', 'answers', 'user']
        read_only_fields = ['date', 'pet', 'status', 'answers', 'user']

class CreateApplicationSerializer(ModelSerializer):
    answers = ApplicationAnswerSerializer(many=True)
    user = UserSerializer(read_only=True)
    pet = PetListingSerializer(read_only=True)
    date = DateTimeField(read_only=True)
    status = CharField(read_only=True)

    class Meta:
        model = Application
        fields = ['date', 'user', 'pet', 'answers', 'status']
        read_only_fields = ['date', 'user', 'pet', 'status']

    def validate(self, data):
        # answers_data format:
        #         data = {
        #     "answers": [
        #         {"answer": "value1", "question_num": 1},
        #         {"answer": "value2", "question_num": 2},
        #     ]
        # }
        answers_data = data.get('answers', [])

        errors = []

        # answer_dict: {"answer": "value1", "question": "Your address:"}
        for answer_dict in answers_data:
            # this part is redundant
            if 'answer' not in answer_dict and 'question_num' in answer_dict:
                errors.append("Each answer must have an 'answer' field.")
            elif 'question_num' not in answer_dict and 'answer' in answer_dict:
                errors.append("Each answer must have a 'question_num' field.")
            if 'question_num' in answer_dict:
                q_num = answer_dict.get('question_num')
                if q_num < 1 or q_num > len(APPLICATION_QUESTIONS):
                    errors.append(f"'{q_num}' is not a valid question number")

            serializer = ApplicationAnswerSerializer(data=answer_dict)
            serializer.is_valid(raise_exception=True)

        # Check if all questions are answered
        answered_questions = {answer_dict.get('question_num') for answer_dict in answers_data}

        missing_questions = set(range(1, len(APPLICATION_QUESTIONS) + 1)) - answered_questions
        for question_num in missing_questions:
            question = APPLICATION_QUESTIONS[question_num - 1]
            errors.append(f"Answer for question {question_num}: '{question}' is required.")

        # check for duplicates
        questions_list = [answer_dict.get('question_num') for answer_dict in answers_data]
        if len(answered_questions) != len(questions_list):
            errors.append("There are duplicate question numbers.")

        if errors:
            raise ValidationError({"answers": errors})

        return data

    def create(self, validated_data):
        user = validated_data.get('user')
        date = validated_data.get('date')
        pet = validated_data.get('pet')
        answers_data = validated_data.get('answers')
        application = Application.objects.create(user=user, date=date, pet=pet, last_update=date)

        for answer in answers_data:
            question_num = answer.get('question_num')
            ApplicationAnswer.objects.create(application=application, question_num=question_num, answer=answer.get('answer'))

        Notification.objects.create(content=application, sender=user, receiver=pet.shelter)

        return application


class UpdateApplicationSerializer(ModelSerializer):
    answers = ApplicationAnswerSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    pet = PetListingSerializer(read_only=True)
    date = DateTimeField(read_only=True)
    status = ChoiceField(choices=Application.Status.choices)

    class Meta:
        model = Application
        fields = ['date', 'user', 'pet', 'answers', 'status']
        read_only_fields = ['date', 'user', 'pet', 'answers']

    def validate(self, data):
        status = data.get('status')

        errors = []
        if status is None:
            errors.append("status field cannot be blank.")
        elif status not in [choice.value for choice in Application.Status]:
            errors.append(f"'{status}' is not a valid status.")

        if errors:
            raise ValidationError({"status": errors})

        return data

    def update(self, instance, validated_data):
        status = validated_data.get('status')
        user = validated_data.get('user')

        existing_status = instance.status
        if user.user_type == 'seeker':
            if existing_status != Application.Status.PENDING and existing_status != Application.Status.ACCEPTED:
                raise ValidationError({"status:": "Seekers can only update pending or accepted applications."})
            if status != Application.Status.WITHDRAWN:
                raise ValidationError({"status": "Seekers can only withdraw applications."})
        else:
            if existing_status != Application.Status.PENDING:
                raise ValidationError({"status": "Shelters can only update pending applications."})
            if status != Application.Status.ACCEPTED and status != Application.Status.DENIED:
                raise ValidationError({"status": "Shelters can only accept or deny applications."})
        instance.status = status
        instance.save()

        if user.user_type == "shelter":
            # receiver is the seeker who made the application
            Notification.objects.create(content=instance, sender=user, receiver=instance.user)
        else:
            # receiver is the shelter of the pet
            Notification.objects.create(content=instance, sender=user, receiver=instance.pet.shelter)
        
        return instance

class ListApplicationSerializer(ModelSerializer):
    answers = ApplicationAnswerSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    pet = PetListingSerializer(read_only=True)
    date = DateTimeField(read_only=True)
    status = CharField(read_only=True)

    filter = ChoiceField(choices=Application.Status.choices, write_only=True, required=False)
    sort = ChoiceField(choices=['create_time', 'update_time'], write_only=True, required=False)

    class Meta:
        model = Application
        fields = ['date', 'user', 'pet', 'answers', 'status', 'filter', 'sort', 'last_update']
        read_only_fields = ['date', 'user', 'pet', 'answers', 'status', 'last_update']

    def to_representation(self, instance):
        return super().to_representation(instance)

    # def validate(self, data):
    #     filter = data.get('filter', None)
    #     sort = data.get('sort', 'create_time')

    #     filter_errors = []
    #     sort_errors = []
    #     if filter and filter not in [choice.value for choice in Application.Status]:
    #         filter_errors.append(f"'{filter}' is not a valid status.")
    #     if sort not in ['create_time', 'update_time']:
    #         sort_errors.append(f"'{sort}' should be either 'create_time' or 'update_time'.")

    #     errors = {}
    #     if filter_errors:
    #         errors["filter"] = filter_errors
    #     if sort_errors:
    #         errors["sort"] = sort_errors
        
    #     if errors:
    #         raise ValidationError(errors)

    #     return data

