# Generated by Django 4.2.6 on 2023-11-10 22:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('petlistings', '0005_remove_listingimage_listing'),
    ]

    operations = [
        migrations.AddField(
            model_name='listingimage',
            name='listing',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='petlistings.petlisting'),
        ),
    ]
