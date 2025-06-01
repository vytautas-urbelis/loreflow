"""Base client interface for AI API interactions."""
from abc import ABC, abstractmethod
from typing import Dict, Generator


class BaseAIClient(ABC):
    """Abstract base class for AI API clients."""

    @abstractmethod
    def complete(self, message: str, response_format: dict | object, **kwargs) -> Dict or str:
        """Send a completion request and return the response."""
        pass

    @abstractmethod
    def stream(self, message: str, **kwargs) -> Generator:
        """Stream a completion request."""
        pass
