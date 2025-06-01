from django.contrib import admin

from prompts.models import Prompt, ResponseFormat


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']


@admin.register(ResponseFormat)
class ResponseFormatAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
