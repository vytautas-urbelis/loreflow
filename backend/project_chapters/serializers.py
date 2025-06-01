# serializers.py
from rest_framework import serializers

from project_scenes.serializers import SceneSerializer
from .models import Chapter, Page


class PageSerializer(serializers.ModelSerializer):
    scenes = SceneSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('id',)


class ChapterSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)
    scenes = SceneSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = '__all__'
        read_only_fields = ('id', 'project')
