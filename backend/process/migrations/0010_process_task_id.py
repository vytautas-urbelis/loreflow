# Generated by Django 5.0.3 on 2025-04-17 12:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('process', '0009_remove_process_subprocess_process_main_process'),
    ]

    operations = [
        migrations.AddField(
            model_name='process',
            name='task_id',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Task ID'),
        ),
    ]
