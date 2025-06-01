from django.db import models


# Create your models here.

class Prompt(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    prompt = models.TextField()

    def __str__(self):
        return self.name


class ResponseFormat(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    format = models.TextField()

    def __str__(self):
        return self.name
