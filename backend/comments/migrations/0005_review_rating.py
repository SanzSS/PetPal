# Generated by Django 4.2.7 on 2023-12-09 19:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("comments", "0004_review_parent_review"),
    ]

    operations = [
        migrations.AddField(
            model_name="review",
            name="rating",
            field=models.FloatField(default=10),
        ),
    ]
