from rest_framework import serializers

from project.models import Project, Book
from project_chapters.serializers import ChapterSerializer
from project_characters.serializers import CharacterSerializer
from project_items.serializers import ItemSerializer
from project_locations.serializers import LocationSerializer
from project_scenes.serializers import SceneSerializer


class ProjectSerializer(serializers.ModelSerializer):
    relationships = SceneSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['characters'] = CharacterSerializer(instance.characters.all(), many=True,
                                                           context=self.context).data
        representation['book'] = BookSerializer(instance.book.all(), many=True,
                                                context=self.context).data
        representation['chapters'] = ChapterSerializer(instance.chapters.all(), many=True,
                                                       context=self.context).data
        representation['items'] = ItemSerializer(instance.items.all(), many=True,
                                                 context=self.context).data
        representation['locations'] = LocationSerializer(instance.locations.all(), many=True,
                                                         context=self.context).data
        return representation


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'project')
