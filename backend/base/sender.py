import json

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse


# import json

class Messenger:
    def __init__(self, channel):
        self.channel = channel
        self.room_group_name = "chanel_%s" % channel

    def send_created_character(self, message, project_id):
        response = json.dumps({'character': message, 'project_id': project_id},
                              cls=DjangoJSONEncoder)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_character",
                "character": response
            }
        )
        return True

    def send_created_item(self, message, project_id):
        response = json.dumps({'item': message, 'project_id': project_id}, cls=DjangoJSONEncoder)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_item",
                "item": response
            }
        )
        return True

    def send_created_location(self, message, project_id):
        response = json.dumps({'location': message, 'project_id': project_id},
                              cls=DjangoJSONEncoder)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_location",
                "location": response
            }
        )
        return True

    def send_created_scene(self, message, project_id):
        response = json.dumps({'scene': message, 'project_id': project_id}, cls=DjangoJSONEncoder)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_scene",
                "scene": response
            }
        )
        return True

    def send_process_to_chat(self, message, request_id):
        response = json.dumps({'request_id': request_id, 'type': 'process', 'process': message},
                              cls=DjangoJSONEncoder)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "process_message",
                "process": response
            }
        )
        return True

    def stream_to_chat(self, message, request_id, process_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "stream_text",
                "text": json.dumps(
                    {'text': message, 'process_id': process_id, 'request_id': request_id},
                    cls=DjangoJSONEncoder)
            }
        )
        return True

    def stream_message_to_chat(self, message, request_id, process):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "stream_message",
                "text": json.dumps({'stream_message': message,
                                    'process': process,
                                    'request_id': request_id},
                                   cls=DjangoJSONEncoder)
            }
        )
        return True

    def stream_scene(self, message, project_id, scene):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "stream_scene",
                "text": json.dumps({'message': message,
                                    'scene': scene,
                                    'project_id': project_id},
                                   cls=DjangoJSONEncoder)
            }
        )
        return True

    def stream_to_existing_scene(self, message, project_id, scene, request_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "stream_to_existing_scene",
                "text": json.dumps(
                    {'message': message, 'scene': scene, 'project_id': project_id,
                     'request_id': request_id},
                    cls=DjangoJSONEncoder)
            }
        )
        return True


def send_characters_websockets(channel, characters):
    # Get the channel layer
    channel_layer = get_channel_layer()
    # message = json.dumps(voucher)

    # Define the room name and group name
    room_name = channel  # Replace with the actual room name
    room_group_name = "chanel_%s" % room_name

    # Send a message to the group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": "extracted_characters",
            "characters": characters
        }
    )

    return HttpResponse("Message sent to WebSocket consumers.")


def collector_updated(secret_key, collector):
    # Get the channel layer
    channel_layer = get_channel_layer()
    # message = json.dumps(voucher)

    # Define the room name and group name
    room_name = secret_key  # Replace with the actual room name
    room_group_name = "chanel_%s" % room_name

    # Send a message to the group
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            "type": "collector_object",
            "collector": collector
        }
    )

    return HttpResponse("Message sent to WebSocket consumers.")
