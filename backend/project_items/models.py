import os
import uuid

from django.db import models

from filmai import settings
from project.models import Project


def image_image_path(instance, filename):
    if instance.id:
        return f'items/{instance.id}_{instance.name}/{filename}'
    else:
        import uuid
        return f'items/temp_{uuid.uuid4()}_{instance.name}/{filename}'


class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255, verbose_name='Name')
    image = models.ImageField(upload_to=image_image_path, null=True, blank=True,
                              verbose_name='Image')
    category = models.CharField(max_length=100, verbose_name='Category', null=True, blank=True)
    description = models.TextField(verbose_name='Description', null=True, blank=True)
    symbolism = models.TextField(verbose_name='Symbolism', null=True, blank=True)

    # Properties as JSONField
    properties = models.JSONField(default=dict, blank=True, verbose_name="Properties")
    # Example structure:
    # {"material": "steel", "size": "medium", "appearance": "...", "unique_traits": "..."}

    # History as JSONField
    history = models.JSONField(default=dict, blank=True, verbose_name="History")
    # Example structure:
    # {"origin": "...", "age": "ancient", "creator": "...",
    # "previous_events": ["event1", "event2"]}

    # Abilities as JSONField
    abilities = models.JSONField(default=list, blank=True, verbose_name="Abilities")
    # Example structure: [{"ability": "..."}, {"ability": "..."}]

    # Ownership as JSONField
    ownership = models.JSONField(default=list, blank=True, verbose_name="Ownership")
    # Example structure: [{"character": "...", "acquisition": "...", "significance": "..."}]

    # Significance as JSONField
    significance = models.JSONField(default=dict, blank=True, verbose_name="Significance")

    # Example structure:
    # {"plot_relevance": "...", "story_function": "...", "symbolic_meaning": "..."}

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            # Get the previous instance from database
            try:
                old_instance = Item.objects.get(id=self.id)
                if old_instance.image and self.image and old_instance.image != self.image:
                    # Delete the old image file
                    if os.path.isfile(old_instance.image.path):
                        os.remove(old_instance.image.path)
            except Item.DoesNotExist:
                pass  # This is a new instance, so no old image to delete

        super().save(*args, **kwargs)

        # If this is a new instance with an image, rename the file to include the new ID
        if self.image and 'temp_' in self.image.name:
            new_folder = f'items/{self.id}_{self.name}'
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
