import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    # Field used for authentication
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    USERNAME_FIELD = 'email'

    # Additional fields, that are used when creating superusers
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)
    ws_chanel_code = models.UUIDField(default=uuid.uuid4, editable=False)
    open_router_api_key = models.CharField(max_length=255, blank=True)
    selected_model = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.email
