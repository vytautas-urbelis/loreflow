# Generated by Django 5.0.3 on 2025-04-23 07:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('project_scenes', '0005_alter_scene_chapter_alter_scene_page'),
    ]

    operations = [
        migrations.AddField(
            model_name='scene',
            name='updated_content',
            field=models.TextField(blank=True, null=True, verbose_name='Updated content'),
        ),
    ]
