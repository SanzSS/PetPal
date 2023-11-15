# Generated by Django 4.2.6 on 2023-11-13 23:59

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petlistings', '0008_alter_listingimage_listing_alter_petlisting_shelter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='petlisting',
            name='age',
        ),
        migrations.AddField(
            model_name='petlisting',
            name='months_old',
            field=models.PositiveIntegerField(blank=True, default=1, validators=[django.core.validators.MaxValueValidator(11.0)]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='petlisting',
            name='years_old',
            field=models.PositiveIntegerField(blank=True, default=1),
            preserve_default=False,
        ),
    ]
