from typing import Dict, Generator

import openai

from .base_client import BaseAIClient
from ..config.settings import DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL


class OpenAIClient(BaseAIClient):
    """Client for OpenAI-compatible API interactions."""

    def __init__(self,
                 api_key: str = None,
                 base_url: str = None,
                 model: str = None):
        """Initialize OpenAI-compatible client."""
        self.client = openai.OpenAI(
            api_key=api_key or DEEPSEEK_API_KEY,
            base_url=base_url or DEEPSEEK_BASE_URL,
        )
        self.model = model or DEEPSEEK_MODEL

    def complete(self, message: str, **kwargs) -> Dict:
        """Send a completion request to API."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            stream=False
        )
        return {"content": response.choices[0].message.content}

    def stream(self, message: str, **kwargs) -> Generator:
        """Stream a completion request from API."""
        return self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": message}],
            stream=True
        )
