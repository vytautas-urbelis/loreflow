import json
from typing import Dict, Generator

from mistralai import Mistral

from .base_client import BaseAIClient
from ..config.settings import MISTRAL_API_KEY, MISTRAL_MODEL


class MistralClient(BaseAIClient):
    """Client for Mistral AI API interactions."""

    def __init__(self, api_key: str = None, model: str = None):
        """Initialize Mistral client with API key and model."""
        self.client = Mistral(api_key=api_key or MISTRAL_API_KEY)
        self.model = model or MISTRAL_MODEL

    def complete(self, message: str, response_format: str = "json_object", **kwargs) -> Dict:
        """Send a completion request to Mistral API."""
        chat_response = self.client.chat.complete(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            response_format={"type": response_format}
        )
        return json.loads(chat_response.choices[0].message.content)

    def stream(self, message: str, response_format: str = "json_object", **kwargs) -> Generator:
        """Stream a completion request from Mistral API."""
        return self.client.chat.stream(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            response_format={"type": response_format}
        )
