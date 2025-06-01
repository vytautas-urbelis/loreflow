"""Serializers for API requests and responses."""
from rest_framework import serializers


class FileUploadSerializer(serializers.Serializer):
    """Serializer for file uploads with project ID."""
    file = serializers.FileField()
    movie_project_id = serializers.CharField()
