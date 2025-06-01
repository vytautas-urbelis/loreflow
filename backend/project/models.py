import os
import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


def movie_image_path(instance, filename):
    folder = f"{instance.id}" if instance.id else "new"
    return f'project/{folder}/{filename}'


def book_path(instance, filename):
    project_id = instance.project.id if instance.project.id else "new"
    return f'project/{project_id}/book/{filename}'


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name='Title')
    description = models.TextField(null=True, blank=True, verbose_name="Description")
    image = models.ImageField(upload_to=movie_image_path, null=True, blank=True,
                              verbose_name='Image')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects',
                                   verbose_name="created by")
    characters_json = models.JSONField(null=True, blank=True, default=list,
                                       verbose_name="Characters JSON")

    chat = models.JSONField(null=True, blank=True, default=list,
                            verbose_name="Chat JSON")  # For frontend
    chat_messages = models.JSONField(null=True, blank=True, default=list,
                                     verbose_name="Chat Messages JSON")  # AI

    # content = models.JSONField(null=True, blank=True, default=dict, verbose_name="Content")

    def save(self, *args, **kwargs):
        # Check if this is an existing instance
        if self.id:
            try:
                # Get the existing instance from the database
                old_instance = Project.objects.get(id=self.id)

                # Check if there's an old image
                if old_instance.image:
                    # Check if image is being removed or replaced
                    if not self.image or (
                            self.image and self.image.name != old_instance.image.name):
                        # Delete the old image file if it exists
                        if os.path.isfile(old_instance.image.path):
                            os.remove(old_instance.image.path)

            except Project.DoesNotExist:
                # New instance, no old image to delete
                pass

        # Call the original save method
        super().save(*args, **kwargs)


class Book(models.Model):
    name = models.CharField(max_length=255, verbose_name='Book name')
    file = models.FileField(upload_to=book_path, verbose_name='Book')
    pages = models.JSONField(null=True, blank=True, default=dict, verbose_name="Book pages")
    size = models.IntegerField(verbose_name='Book size', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='book',
                                verbose_name='Project')

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        # Store the file path before deletion
        if self.file:
            file_path = self.file.path
            # Delete the model instance first
            super().delete(*args, **kwargs)
            # Then remove the file from storage
            import os
            if os.path.isfile(file_path):
                os.remove(file_path)
        else:
            super().delete(*args, **kwargs)
