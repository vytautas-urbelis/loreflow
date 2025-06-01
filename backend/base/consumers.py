import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    room_name = ''
    room_group_name = ''

    async def connect(self):
        print('connecting')
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(self.room_name)
        self.room_group_name = "chanel_%s" % self.room_name
        print(f'Connecting to room group: {self.room_group_name}')

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

        print(f'WebSocket disconnected: close_code: {close_code}')

    async def receive(self, text_data=None, bytes_data=None):
        print('received')
        print(text_data)

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def send_character(self, event):
        character = event["character"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"character": character}))

    async def send_item(self, event):
        item = event["item"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"item": item}))

    async def send_location(self, event):
        location = event["location"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"location": location}))

    async def send_scene(self, event):
        scene = event["scene"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"scene": scene}))

    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    async def extracted_characters(self, event):
        characters = event["characters"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"characters": characters}))

    async def process_message(self, event):
        process = event["process"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"process": process}))

    async def stream_text(self, event):
        text = event["text"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"stream_text": text}))

    async def stream_message(self, event):
        text = event["text"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"stream_message": text}))

    async def stream_scene(self, event):
        text = event["text"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"stream_scene": text}))

    async def stream_to_existing_scene(self, event):
        text = event["text"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"stream_to_existing_scene": text}))
