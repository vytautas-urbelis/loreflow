import uuid

from django.db import models

from project.models import Project


class Chapter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name='chapters', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True,
                                      verbose_name='Created at')

    # pages = models.JSONField(default=list, blank=True, verbose_name="Pages")

    def __str__(self):
        return self.name


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter = models.ForeignKey(Chapter, related_name='pages', on_delete=models.CASCADE)
    text = models.TextField(default='', verbose_name="Text")
    sequence = models.IntegerField(verbose_name="Sequence")  # To maintain page order
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True,
                                      verbose_name='Created at')

    characters = models.JSONField(default=list, blank=True, verbose_name="Characters")
    locations = models.JSONField(default=list, blank=True, verbose_name="Locations")
    items = models.JSONField(default=list, blank=True, verbose_name="Items")

    # scenes = models.JSONField(default=list, blank=True, verbose_name="Scenes")

    class Meta:
        ordering = ['sequence']

    def __str__(self):
        return f"Page {self.sequence} - {self.chapter.name}"
