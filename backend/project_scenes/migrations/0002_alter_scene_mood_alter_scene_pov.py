# Generated by Django 5.0.3 on 2025-04-18 15:33

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('project_scenes', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scene',
            name='mood',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Mood'),
        ),
        migrations.AlterField(
            model_name='scene',
            name='pov',
            field=models.CharField(blank=True, max_length=255, null=True,
                                   verbose_name='Point of View'),
        ),
    ]
