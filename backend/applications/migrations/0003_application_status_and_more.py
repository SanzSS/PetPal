# Generated by Django 4.2.7 on 2023-11-14 19:36

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("applications", "0002_application_pet"),
    ]

    operations = [
        migrations.AddField(
            model_name="application",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("accepted", "Accepted"),
                    ("withdrawn", "Withdrawn"),
                    ("denied", "Denied"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="applicationanswer",
            name="question_num",
            field=models.IntegerField(
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(22),
                ]
            ),
        ),
        migrations.AddConstraint(
            model_name="applicationanswer",
            constraint=models.UniqueConstraint(
                fields=("application", "question_num"),
                name="unique_question_num_per_application",
            ),
        ),
    ]
