# Generated by Django 5.0.3 on 2025-04-24 11:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('project', '0004_project_chat_messages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(blank=True, null=True, verbose_name='Description'),
        ),
    ]
