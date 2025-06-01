import uuid

from django.db import models

from project.models import Project
from project_chapters.models import Page, Chapter


class Scene(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, related_name='scenes', null=True, blank=True,
                             on_delete=models.SET_NULL)
    chapter = models.ForeignKey(Chapter, related_name='scenes', null=True, blank=True,
                                on_delete=models.SET_NULL)
    project = models.ForeignKey(Project, related_name='scenes', null=True, blank=True,
                                on_delete=models.CASCADE)

    title = models.CharField(max_length=255, verbose_name='Title')
    sequence = models.IntegerField(verbose_name="Sequence")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True,
                                      verbose_name='Created at')

    summary = models.TextField(blank=True, null=True, verbose_name="Summary")
    content = models.TextField(blank=True, null=True, verbose_name="Content")

    updated_content = models.TextField(blank=True, null=True, verbose_name="Updated content")

    # Keep ManyToMany relationships for main entities
    characters = models.JSONField(default=list, blank=True, null=True, verbose_name="Characters")
    location = models.JSONField(default=dict, blank=True, null=True, verbose_name="Location")
    items = models.JSONField(default=list, blank=True, null=True, verbose_name="Items")

    # Convert these to JSONFields
    time = models.JSONField(default=dict, blank=True, null=True, verbose_name="Time")
    # Example structure: {"time_of_day": "Dusk", "date": "2023-09-15"}

    weather = models.JSONField(default=dict, blank=True, null=True, verbose_name="Weather")
    # Example structure:
    # {"condition": "Stormy", "description": "Thunder rumbles in the distance..."}

    goals = models.JSONField(default=list, blank=True, null=True, verbose_name="Goals")
    # Example structure: [{"description": "Alice needs to retrieve..."}, {...}]

    conflict = models.JSONField(default=dict, blank=True, null=True, verbose_name="Conflict")
    # Example structure:
    # {"description": "The Stranger demands proof...", "resolution": "Alice shows..."}

    outcome = models.JSONField(default=dict, blank=True, null=True, verbose_name="Outcome")
    # Example structure: {"description": "The Stranger provides the information..."}

    mood = models.CharField(max_length=255, blank=True, null=True, verbose_name="Mood")
    pov = models.CharField(max_length=255, blank=True, null=True, verbose_name="Point of View")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")

    class Meta:
        ordering = ['sequence']

    def __str__(self):
        return f"Page {self.page}: {self.title}"
