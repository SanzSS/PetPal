# Generated by Django 4.2.7 on 2023-12-09 00:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("applications", "0004_application_last_update_alter_application_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="application",
            name="rating",
            field=models.IntegerField(default=0),
        ),
    ]
