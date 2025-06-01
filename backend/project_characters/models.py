import os
import uuid

from django.db import models

from filmai import settings
from project.models import Project


def character_image_path(instance, filename):
    if instance.id:
        return f'characters/{instance.id}_{instance.name}/{filename}'
    else:
        import uuid
        return f'characters/temp_{uuid.uuid4()}_{instance.name}/{filename}'


class Character(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, related_name='characters', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, verbose_name='Name')
    image = models.ImageField(upload_to=character_image_path, null=True, blank=True,
                              verbose_name='Image')
    symbolism = models.TextField(null=True, blank=True, verbose_name="Symbolism")
    character_arc = models.TextField(null=True, blank=True, verbose_name='Arc')

    aliases = models.JSONField(default=list, null=True, blank=True, verbose_name="Aliases")
    role = models.JSONField(default=dict, null=True, blank=True, verbose_name="Role")
    demographics = models.JSONField(default=dict, null=True, blank=True,
                                    verbose_name="Demographics")
    appearance = models.JSONField(default=dict, null=True, blank=True, verbose_name="appearance")
    personality = models.JSONField(default=dict, null=True, blank=True, verbose_name="Personality")
    backstory = models.JSONField(default=dict, null=True, blank=True, verbose_name="Backstory")
    relationships = models.JSONField(default=list, null=True, blank=True,
                                     verbose_name="Relationships")
    additional_information = models.JSONField(default=dict, null=True, blank=True,
                                              verbose_name="Additional Information")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            # Get the previous instance from database
            try:
                old_instance = Character.objects.get(id=self.id)
                if old_instance.image and self.image and old_instance.image != self.image:
                    # Delete the old image file
                    if os.path.isfile(old_instance.image.path):
                        os.remove(old_instance.image.path)
            except Character.DoesNotExist:
                pass  # This is a new instance, so no old image to delete

        super().save(*args, **kwargs)

        # If this is a new instance with an image, rename the file to include the new ID
        if self.image and 'temp_' in self.image.name:
            new_folder = f'characters/{self.id}_{self.name}'
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
