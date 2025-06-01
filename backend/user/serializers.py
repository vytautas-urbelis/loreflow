from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    # Make sure password is write-only and styled as a password input.
    password = serializers.CharField(write_only=True, required=True,
                                     style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name',
                  'ws_chanel_code', 'open_router_api_key', 'selected_model']

    def create(self, validated_data):
        # Pop the password and use set_password to hash it.
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Update user instance, and handle password separately.
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
