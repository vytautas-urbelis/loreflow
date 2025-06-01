import os
import uuid

from django.db import models

from filmai import settings
from project.models import Project


def location_image_path(instance, filename):
    if instance.id:
        return f'locations/{instance.id}_{instance.name}/{filename}'
    else:
        import uuid
        return f'locations/temp_{uuid.uuid4()}_{instance.name}/{filename}'


class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name='locations', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, verbose_name='Name')
    image = models.ImageField(upload_to=location_image_path, blank=True, null=True,
                              verbose_name='Image')
    description = models.TextField(blank=True, verbose_name="Description")
    symbolism = models.TextField(blank=True, verbose_name="Symbolism")
    type = models.CharField(max_length=100, blank=True, verbose_name="Type")

    # Geography as JSONField
    geography_details = models.JSONField(default=dict, blank=True, verbose_name="Geography")
    # Example structure: {"terrain": "Mountainous valley", "climate": "Temperate",
    # "flora": "...", "fauna": "...", "natural_resources": "..."}

    # Culture as JSONField
    culture_details = models.JSONField(default=dict, blank=True, verbose_name="Culture")
    # Example structure: {"language": "Common tongue", "customs": "...", "religion": "...",
    # "social_structure": "...", "arts": "..."}

    # Historical events as JSONField
    historical_events = models.JSONField(default=list, blank=True,
                                         verbose_name="Historical Events")
    # Example structure:
    # [{"title": "The Great Flood", "date": "300 years ago", "description": "...",
    # "significance": "..."}]

    # Points of interest as JSONField
    points_of_interest = models.JSONField(default=list, blank=True,
                                          verbose_name="Points of Interest")
    # Example structure: [{"name": "The Ancient Oak", "description": "...", "significance": "..."}]

    # Inhabitants as JSONField
    inhabitants_list = models.JSONField(default=list, blank=True, verbose_name="Inhabitants")
    # Example structure:
    # [{"name": "Elder Thorne", "role": "Chief Council Member", "description": "..."}]

    # Atmosphere as JSONField
    atmosphere_details = models.JSONField(default=dict, blank=True, verbose_name="Atmosphere")

    # Example structure: {"mood": "Serene yet mysterious", "lighting": "...", "sounds": "...",
    # "smells": "...", "general_feel": "..."}

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            # Get the previous instance from database
            try:
                old_instance = Location.objects.get(id=self.id)
                if old_instance.image and self.image and old_instance.image != self.image:
                    # Delete the old image file
                    if os.path.isfile(old_instance.image.path):
                        os.remove(old_instance.image.path)
            except Location.DoesNotExist:
                pass  # This is a new instance, so no old image to delete

        super().save(*args, **kwargs)

        # If this is a new instance with an image, rename the file to include the new ID
        if self.image and 'temp_' in self.image.name:
            new_folder = f'locations/{self.id}_{self.name}'
            new_name = f'{new_folder}/{os.path.basename(self.image.name)}'
            new_path = os.path.join(settings.MEDIA_ROOT, new_name)

            # Ensure target directory exists
            os.makedirs(os.path.dirname(new_path), exist_ok=True)

            # Rename the file
            os.rename(self.image.path, new_path)

            # Update the database record
            self.image.name = new_name
            super().save(update_fields=['image'])

    def delete(self, *args, **kwargs):
        # Delete the image file from storage
        if self.image and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        super().delete(*args, **kwargs)
