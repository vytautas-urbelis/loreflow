from django.contrib import admin

from process.models import Process, SubProcess


@admin.register(Process)
class ProcessAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'updated_at', 'status', 'project']


@admin.register(SubProcess)
class SubProcessAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'updated_at', 'status']
