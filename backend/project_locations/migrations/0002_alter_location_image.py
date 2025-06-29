# Generated by Django 5.0.3 on 2025-04-15 10:47

from django.db import migrations, models

import project_locations.models


class Migration(migrations.Migration):
    dependencies = [
        ('project_locations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='image',
            field=models.ImageField(blank=True, null=True,
                                    upload_to=project_locations.models.location_image_path,
                                    verbose_name='Image'),
        ),
    ]
