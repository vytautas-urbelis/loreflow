"""Configuration settings for AI services."""
from django.conf import settings

# Mistral configuration
MISTRAL_API_KEY = getattr(settings, 'MISTRAL_API_KEY', '')
MISTRAL_MODEL = getattr(settings, 'MISTRAL_MODEL', 'ministral-8b-latest')

# OpenAI/Deepseek configuration
DEEPSEEK_API_KEY = getattr(settings, 'DEEPSEEK_API_KEY', '')
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"

# OpenAI/Deepseek configuration
# OPEN_ROUTER_API_KEY = getattr(settings, 'OPEN_ROUTER_API_KEY', '')
OPEN_ROUTER_BASE_URL = "https://openrouter.ai/api/v1"
# OPEN_ROUTER_MODEL = "mistralai/mistral-small-3.1-24b-instruct:free"
OPEN_ROUTER_MODEL = "google/gemini-flash-1.5-8b-exp"
# OPEN_ROUTER_MODEL = "google/gemini-2.5-pro-exp-03-25:free"

# Websocket settings
DEFAULT_CHANNEL = "hLgU6xUJLY0eNzs"

# PDF processing settings
PAGES_PER_CHUNK = 30

# PDF processeing for CHAPTERS
CHUNK_PAGES = 5
