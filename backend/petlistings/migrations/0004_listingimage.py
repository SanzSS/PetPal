# Generated by Django 4.2.6 on 2023-11-10 21:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('petlistings', '0003_rename_creation_date_petlisting_listing_date_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ListingImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='listingimages')),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='petlistings.petlisting')),
            ],
        ),
    ]
