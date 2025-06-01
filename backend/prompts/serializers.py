from rest_framework import serializers

from .models import Prompt, ResponseFormat


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = '__all__'
        read_only_fields = ()


class ResponseFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponseFormat
        fields = '__all__'
        read_only_fields = ()
