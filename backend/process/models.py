import uuid

from django.db import models

from project.models import Project


# Create your models here.

class Process(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
    status = models.CharField(max_length=20, default="in_progress",
                              verbose_name='Status')  # in_progress, completed, canceled, failed
    task_id = models.CharField(max_length=50, null=True, blank=True, verbose_name='Task ID')
    type = models.CharField(max_length=80, null=True, blank=True, default='process',
                            verbose_name='Type')
    description = models.TextField(max_length=500, null=True, verbose_name='Description')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='processes',
                                verbose_name="Project")
    main_process = models.ForeignKey('Process', null=True, blank=True,
                                     related_name='sub_processes',
                                     on_delete=models.CASCADE, )

    """ Data from ai response"""
    model_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Model name")
    price_prompt_tokens = models.FloatField(default=0, null=True, blank=True,
                                            verbose_name="Price prompt tokens")
    price_completion_tokens = models.FloatField(default=0, null=True, blank=True,
                                                verbose_name="Price completion tokens")
    used_prompt_tokens = models.IntegerField(default=0, null=True, blank=True,
                                             verbose_name="Used prompt tokens")
    used_completion_tokens = models.IntegerField(default=0, null=True, blank=True,
                                                 verbose_name="Used completion tokens")


class SubProcess(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
    status = models.CharField(max_length=20, default="in_progress",
                              verbose_name='Status')  # in_progress, completed, canceled, failed
    description = models.TextField(max_length=500, null=True, verbose_name='Description')
    process = models.ForeignKey(Process, null=True, blank=True, on_delete=models.CASCADE,
                                related_name='subprocesses',
                                verbose_name="Process")
    subprocess = models.ForeignKey('SubProcess', null=True, blank=True, on_delete=models.CASCADE,
                                   related_name='subprocesses', verbose_name="Subprocess")
    """ Data from ai response"""
    model_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Model name")
    price_prompt_tokens = models.FloatField(default=0, null=True, blank=True,
                                            verbose_name="Price prompt tokens")
    price_completion_tokens = models.FloatField(default=0, null=True, blank=True,
                                                verbose_name="Price completion tokens")
    used_prompt_tokens = models.IntegerField(default=0, verbose_name="Used prompt tokens")
    used_completion_tokens = models.IntegerField(default=0, null=True, blank=True,
                                                 verbose_name="Used completion tokens")
