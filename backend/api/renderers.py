# api/renderers.py
from rest_framework import renderers


class EventStreamRenderer(renderers.BaseRenderer):
    media_type = 'text/event-stream'
    format = 'sse'  # Custom format identifier

    def render(self, data, media_type=None, renderer_context=None):
        return data  # Directly return the streaming content
