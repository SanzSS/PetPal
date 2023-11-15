# Generated by Django 4.2.7 on 2023-11-15 03:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("comments", "0003_remove_comment_shelter_remove_comment_type_review"),
    ]

    operations = [
        migrations.AddField(
            model_name="review",
            name="parent_review",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="comments.review",
            ),
        ),
    ]