"""Utilities for WebSocket communication."""
import json
from typing import Any

from base.sender import send_characters_websockets
from ..config.settings import DEFAULT_CHANNEL


def send_to_websocket(content: Any, channel: str = DEFAULT_CHANNEL):
    """Send content to WebSocket channel."""
    if isinstance(content, dict):
        content = json.dumps(content)
    send_characters_websockets(channel, content)


def format_stream_message(content: str) -> str:
    """Format a message for SSE streaming."""
    return f"data: {content}\n\n"


def format_done_message() -> str:
    """Format the done message for SSE streaming."""
    return "data: [DONE]\n\n"
