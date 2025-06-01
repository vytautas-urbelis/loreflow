"""Services for extracting and managing character data."""
import json
from typing import Dict, Optional

from ..clients.base_client import BaseAIClient
from ..clients.mistral_client import MistralClient
from ..config.settings import DEFAULT_CHANNEL
from ..prompts.character_prompts import generate_character_system_prompt
from ..utils.stream_utils import accumulate_json_from_stream
from ..utils.websocket_utils import send_to_websocket


def extract_characters(
        text: str,
        channel: str = DEFAULT_CHANNEL,
        existing_characters: Dict = None,
        movie_project_id: Optional[str] = None,
        client: BaseAIClient = None,
        stream: bool = False
) -> Dict:
    """Extract characters from text using AI."""
    existing_characters = existing_characters or {}
    client = client or MistralClient()

    # Generate system prompt
    system_prompt = generate_character_system_prompt(existing_characters)
    message = f'Instructions:{system_prompt}; Book: {text}'

    # Choose extraction method based on streaming preference
    if stream:
        return extract_characters_stream(message, channel, client)
    else:
        return extract_characters_complete(message, channel, movie_project_id, client)


def extract_characters_complete(
        message: str,
        channel: str,
        movie_project_id: Optional[str] = None,
        client: BaseAIClient = None
) -> Dict:
    """Extract characters using complete API call."""
    client = client or MistralClient()

    try:
        # Get content from the client
        content = client.complete(message)
        # if content.content.find('```json') is not -1:
        #     content = content_type_to_dict(content)
        #
        # print(type(content), content)

        # Add movie project ID if provided
        if movie_project_id:
            content_with_id = content.copy()
            content_with_id['movie_project_id'] = movie_project_id
            send_to_websocket(json.dumps(content_with_id), channel)

        return content
    except Exception as e:
        print(f"Error in AI completion: {str(e)}")
        return {"error": str(e)}


def extract_characters_stream(
        message: str,
        channel: str,
        client: BaseAIClient = None
) -> Dict:
    """Extract characters using streaming API call."""
    client = client or MistralClient()

    try:
        # Get the stream from the client
        stream_response = client.stream(message)

        # Process the stream to build JSON
        return accumulate_json_from_stream(stream_response)
    except Exception as e:
        print(f"Error in streaming response: {str(e)}")
        return {"error": str(e)}


def content_type_to_dict(content) -> dict:
    # Check if the string starts with ``````
    start_marker = '```json'
    end_marker = '```'

    start_index = content.find(start_marker)
    # if start_index == -1:
    #     return None

    # Calculate the actual content start (after the marker)
    content_start = start_index + len(start_marker)

    # # Find the end marker after the start marker
    end_index = content.find(end_marker, content_start)
    # if end_index == -1:
    #     return None

    # Extract the JSON string between the markers
    json_string = content[content_start:end_index].strip()

    # Parse the JSON string into a Python dictionary
    try:
        parsed_data = json.loads(json_string)
        return parsed_data
    except json.JSONDecodeError:
        # Handle the case where the extracted string is not valid JSON
        print("not valid json")
        return content
