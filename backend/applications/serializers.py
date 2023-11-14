from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import (CharField, IntegerField, ModelSerializer,
                                        Serializer, ValidationError)
from .models import Application, ApplicationAnswer
from .constants import APPLICATION_QUESTIONS
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from petlistings.models import PetListing


class ApplicationAnswerSerializer(ModelSerializer):
    question = CharField()

    class Meta:
        model = ApplicationAnswer
        fields = ['question', 'answer']


class ApplicationSerializer(ModelSerializer):
    answers = ApplicationAnswerSerializer(many=True)

    class Meta:
        model = Application
        fields = ["answers"]

    def validate(self, data):
        # answers_data format: 
        #         data = {
        #     "answers": [
        #         {"answer": "value1", "question": "Your address:"},
        #         {"answer": "value2", "question": "City:"},
        #     ]
        # }
        answers_data = data.get('answers', [])

        errors = []

        # answer_dict: {"answer": "value1", "question": "Your address:"}
        for answer_dict in answers_data:
            if 'answer' not in answer_dict and 'question' in answer_dict:
                errors.append("Each answer must have an 'answer' field.")
            elif 'question' not in answer_dict and 'answer' in answer_dict:
                errors.append("Each answer must have a 'question' field.")
            if 'question' in answer_dict:
                q = answer_dict.get('question')
                if q not in APPLICATION_QUESTIONS:
                    errors.append(f"'{q}' is not a valid question")

            serializer = ApplicationAnswerSerializer(data=answer_dict)
            serializer.is_valid(raise_exception=True)

        # Check if all questions are answered
        answered_questions = {answer_dict.get('question') for answer_dict in answers_data}

        missing_questions = APPLICATION_QUESTIONS.keys() - answered_questions
        for question in missing_questions:
            errors.append(f"Answer for question '{question}' is required.")

        if errors:
            raise ValidationError({"answers": errors})
    
        return data
    
    def create(self, validated_data):
        user = validated_data.get('user')
        date = validated_data.get('date')
        pet_id = validated_data.get('pet')
        answers_data = validated_data.get('answers')
        application = Application.objects.create(user=user.id, date=date, pet=pet_id)

        for answer in answers_data:
            question_num = APPLICATION_QUESTIONS.get(answer.get('question'))
            ApplicationAnswer.objects.create(application=application.id, question_num=question_num, answer=answer.get('answer'))

        # pet = get_object_or_404(PetListing, id=pet_id)
        # Notification.objects.create(content=application, sender=user.id, receiver=pet.shelter)

        return application
    