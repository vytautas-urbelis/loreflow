# from rest_framework import serializers
# from .models import Scene, Time, Weather, Goal, Conflict, Outcome
#
#
# class TimeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Time
#         fields = ['id', 'time_of_day', 'date']
#
#
# class WeatherSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Weather
#         fields = ['id', 'condition', 'description']
#
#
# class GoalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Goal
#         fields = ['id', 'description']
#
#
# class ConflictSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Conflict
#         fields = ['id', 'description', 'resolution']
#
#
# class OutcomeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Outcome
#         fields = ['id', 'description']
#
#
# class SceneSerializer(serializers.ModelSerializer):
#     time = TimeSerializer(required=False, allow_null=True)
#     weather = WeatherSerializer(required=False, allow_null=True)
#     goals = GoalSerializer(many=True, required=False)
#     conflict = ConflictSerializer(required=False, allow_null=True)
#     outcome = OutcomeSerializer(required=False, allow_null=True)
#
#     class Meta:
#         model = Scene
#         fields = [
#             'id', 'project', 'title', 'chapter', 'sequence', 'summary',
#             'content', 'characters', 'location', 'items', 'time',
#             'weather', 'goals', 'conflict', 'outcome', 'mood', 'pov', 'notes'
#         ]
#
#     def create(self, validated_data):
#         # Extract nested data
#         time_data = validated_data.pop('time', None)
#         weather_data = validated_data.pop('weather', None)
#         goals_data = validated_data.pop('goals', [])
#         conflict_data = validated_data.pop('conflict', None)
#         outcome_data = validated_data.pop('outcome', None)
#
#         # Create the scene
#         scene = Scene.objects.create(**validated_data)
#
#         # Create related objects if provided
#         if time_data:
#             time_instance = Time.objects.create(**time_data)
#             scene.time = time_instance
#
#         if weather_data:
#             weather_instance = Weather.objects.create(**weather_data)
#             scene.weather = weather_instance
#
#         if conflict_data:
#             conflict_instance = Conflict.objects.create(**conflict_data)
#             scene.conflict = conflict_instance
#
#         if outcome_data:
#             outcome_instance = Outcome.objects.create(**outcome_data)
#             scene.outcome = outcome_instance
#
#         # Create and add goals
#         for goal_data in goals_data:
#             goal_instance = Goal.objects.create(**goal_data)
#             scene.goals.add(goal_instance)
#
#         scene.save()
#         return scene
from rest_framework import serializers

from .models import Scene


class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = '__all__'
        read_only_fields = ()
