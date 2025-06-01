from rest_framework import serializers

from process.models import Process, SubProcess


class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'project')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sub_processes'] = ProcessSerializer(instance.sub_processes.all(),
                                                            many=True,
                                                            context=self.context).data
        return representation


class SubProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubProcess
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'process')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['subprocesses'] = SubProcessSerializer(instance.subprocesses.all(),
                                                              many=True,
                                                              context=self.context).data
        return representation
