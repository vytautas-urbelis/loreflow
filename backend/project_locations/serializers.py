from rest_framework import serializers

from .models import Location


class LocationSerializer(serializers.ModelSerializer):
    """Serializer for listing locations with minimal information"""

    class Meta:
        model = Location
        fields = '__all__'
