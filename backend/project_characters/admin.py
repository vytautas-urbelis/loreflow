from django.contrib import admin

from project_characters.models import Character


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ['name', 'project']
