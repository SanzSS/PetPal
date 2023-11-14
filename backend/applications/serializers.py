from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import (CharField, IntegerField, ModelSerializer,
                                        Serializer, ValidationError)
from .models import Application, ApplicationAnswer
from .constants import APPLICATION_QUESTIONS

class QuestionSerializer(Serializer):
    question_text = CharField()

class ApplicationAnswerSerializer(ModelSerializer):
    question = QuestionSerializer(read_only=True)

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

        # answer_dict: {"answer": "value1", "question": "Your address:"}
        for answer_dict in answers_data:
            serializer = ApplicationAnswerSerializer(data=answer_dict)
            serializer.is_valid(raise_exception=True)

        # Check if all questions are answered
        answered_questions = {answer_dict.get('question') for answer_dict in answers_data}

        missing_questions = APPLICATION_QUESTIONS.keys() - answered_questions
        for question in missing_questions:
            raise ValidationError(
                {"answers": f"Answer for questions {question} is required."}
            )

        return data
    
    def create(self, validated_data):
        user = validated_data.get('user')
        date = validated_data.get('date')
        pet_id = validated_data.get('pet_id')
        answers_data = validated_data.pop('answers')
        application = Application.objects.create(user=user.id, date=date, pet=pet_id)

        for answer in answers_data:
            question_num = APPLICATION_QUESTIONS[answer['question_text']] 
            ApplicationAnswer.objects.create(application=application.id, **answer)

        return application
    