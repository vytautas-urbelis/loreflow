"""Configuration settings for AI services."""
from django.conf import settings

# Mistral configuration
MISTRAL_API_KEY = getattr(settings, 'MISTRAL_API_KEY', '')
MISTRAL_MODEL = getattr(settings, 'MISTRAL_MODEL', 'ministral-8b-latest')

# OpenAI/Deepseek configuration
DEEPSEEK_API_KEY = getattr(settings, 'DEEPSEEK_API_KEY', '')
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"

# Websocket settings
DEFAULT_CHANNEL = "hLgU6xUJLY0eNzs"

# PDF processing settings
PAGES_PER_CHUNK = 30
