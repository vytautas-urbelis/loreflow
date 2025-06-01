from django.contrib import admin

from project_scenes.models import Scene


@admin.register(Scene)
class SceneAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'page', 'sequence']
