"""Client for interacting with OpenAI-compatible APIs."""
import json
from typing import Dict

import json_repair
import openai
import requests

from process.models import Process
from process.serializers import ProcessSerializer
from .base_client import BaseAIClient
from ..config.settings import OPEN_ROUTER_BASE_URL, OPEN_ROUTER_MODEL


class OpenRouterClient(BaseAIClient):
    """Client for OpenAI-compatible API interactions."""

    def __init__(self,
                 api_key: str = None,
                 base_url: str = None,
                 model: str = None):
        """Initialize OpenAI-compatible client."""
        self.client = openai.OpenAI(
            api_key=api_key,
            base_url=base_url or OPEN_ROUTER_BASE_URL,
        )
        self.api_key = api_key
        self.model = model or OPEN_ROUTER_MODEL

    def complete(self, messages: list, client, **kwargs) -> Dict:
        """Send a completion request to API."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            response_format={"type": "json_object"},
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
        )
        content = response.choices[0].message.content
        usage = {'completion_tokens': response.usage.completion_tokens,
                 'prompt_tokens': response.usage.prompt_tokens}
        content = self.extract_json_object(content)
        reformated_json = client.reformat_json(content)
        try:
            content = self.extract_json_object(reformated_json['content'])
            content = json.loads(content)
        except Exception as e:
            print(e)
        data = {'usage': usage, 'content': content}
        return data

    def stream_structured(self, messages: list, response_format, messenger, request_id, process_id,
                          **kwargs) -> Dict:
        """Stream a completion request and return processed JSON."""
        try:
            stream = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://loreflow.app",
                    "X-Title": "LoreFlow",  # Optional. Site title for rankings
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": True,
                    'stop': ['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
                    "response_format": {
                        "type": "json_schema",
                        "json_schema": {
                            "name": "response",
                            "strict": True,
                            "schema": {
                                "type": "object",
                                "properties": response_format,
                                "required": list(response_format.keys()),
                                "additionalProperties": False
                            },

                        }
                    }
                },
                stream=True,
                timeout=30  # Added timeout
            )
            stream.raise_for_status()  # Check HTTP status

            full_content = ""
            for line in stream.iter_lines():
                # print(f"final : {line}")
                if line:
                    decoded_line = line.decode('utf-8').strip()
                    if decoded_line.startswith('data: '):
                        chunk_data = decoded_line[6:]
                        if chunk_data == '[DONE]':
                            break

                        try:
                            chunk = json.loads(chunk_data)
                            content = chunk.get('choices', [{}])[0].get('delta', {}).get('content',
                                                                                         '')
                            if content:
                                full_content += content
                                # print(f"final : {content}")
                                # messenger.stream_to_chat(content, request_id, process_id)
                        except json.JSONDecodeError as e:
                            print(f"Failed to decode chunk: {chunk_data} | Error: {e}")

            try:
                final_content = json_repair.repair_json(full_content, return_objects=True)
                print(f"final : {final_content}")
            except (json.JSONDecodeError, KeyError) as e:
                print(f"JSON parsing error: {e}")
                final_content = None

            return {
                'usage': {
                    'completion_tokens': 0,  # Not available in streaming
                    'prompt_tokens': 0  # Not available in streaming
                },
                'content': final_content,
                'raw_content': full_content,
            }

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            return {'error': str(e)}
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return {'error': f"Processing error: {str(e)}"}

    def stream(self, messages: list, client, messenger, request_id, process_id, **kwargs) -> Dict:
        """Stream a completion request and return processed JSON."""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            # response_format={"type": "json_object"},
            stream=True,
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            # print("chunk: ", chunk)
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                # messenger.stream_to_chat(chunk.choices[0].delta.content, request_id, process_id)

        try:
            final_content = json_repair.repair_json(full_content, return_objects=True)

        except (json.JSONDecodeError, KeyError) as e:
            print(f"JSON parsing error: {e}")
            final_content = None

        return {
            'usage': {
                'completion_tokens': 0,  # Not available in streaming
                'prompt_tokens': 0  # Not available in streaming
            },
            'content': final_content,
            'raw_content': full_content,
        }

    def stream_text(self, messages: list, client, messenger, request_id, process_id,
                    **kwargs) -> Dict:
        """Stream a completion request and return processed JSON."""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            stream=True,
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                # messenger.stream_to_chat(chunk.choices[0].delta.content, request_id, process_id)
        print("Full content: ", full_content)

        try:
            content = self.extract_json_object(full_content)
            full_content = json_repair.repair_json(content, return_objects=True)
        except Exception as e:
            print(e)

        return {
            'usage': {
                'completion_tokens': 0,  # Not available in streaming
                'prompt_tokens': 0  # Not available in streaming
            },
            'content': full_content,
        }

    def stream_text_to_chat(self, messages: list, messenger, request_id, process, **kwargs) -> str:
        """Stream a completion request and return processed JSON."""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            stream=True,
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                messenger.stream_message_to_chat(
                    self.clean_response_string(chunk.choices[0].delta.content), request_id,
                    process)

        print("Full content: ", full_content)
        # When finish streaming update process as finished
        process = Process.objects.get(id=process['id'])
        process.status = "succeeded"
        process.save()

        # update frontend
        messenger.stream_message_to_chat('', request_id, ProcessSerializer(process).data)

        return full_content

    def stream_scene(self, messages: list, messenger, request_id, process, scene, **kwargs) -> str:
        """Stream a completion request and return processed JSON."""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            stream=True,
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                messenger.stream_scene(self.clean_response_string(chunk.choices[0].delta.content),
                                       process['project'],
                                       scene)

        print("Full content: ", full_content)
        # When finish streaming update process as finished
        process = Process.objects.get(id=process['id'])
        process.status = "succeeded"
        print("saving process: ")
        process.save()
        print("Process saved ")

        # update frontend
        messenger.stream_message_to_chat('', request_id, ProcessSerializer(process).data)

        return full_content

    def stream_to_existing_scene(self, messages: list, messenger, request_id, process, scene,
                                 **kwargs) -> str:
        """Stream a completion request and return processed JSON."""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            stream=True,
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                messenger.stream_to_existing_scene(
                    self.clean_response_string(chunk.choices[0].delta.content),
                    process['project'], scene, request_id)

        print("Full content: ", full_content)
        # When finish streaming update process as finished
        process = Process.objects.get(id=process['id'])
        process.status = "succeeded"
        process.save()

        # update frontend
        messenger.stream_message_to_chat('', process['project'], ProcessSerializer(process).data,
                                         request_id)

        return full_content

    def generate_image(self, messages: list, messenger, request_id, process, scene,
                                 **kwargs) -> str:
        """Generate Image"""
        stream = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=messages,
            **kwargs
        )

        full_content = ""
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content += chunk.choices[0].delta.content
                messenger.stream_to_existing_scene(
                    self.clean_response_string(chunk.choices[0].delta.content),
                    process['project'], scene, request_id)

        print("Full content: ", full_content)
        # When finish streaming update process as finished
        process = Process.objects.get(id=process['id'])
        process.status = "succeeded"
        process.save()

        # update frontend
        messenger.stream_message_to_chat('', process['project'], ProcessSerializer(process).data,
                                         request_id)

        return full_content

    def extract_json_object(self, text):
        # Find indexes of all '{' characters
        open_braces = [i for i, char in enumerate(text) if char == '{']

        # Find indexes of all '}' characters
        close_braces = [i for i, char in enumerate(text) if char == '}']

        # Check if we have both opening and closing braces
        if open_braces and close_braces:
            # Get the first '{' index and the last '}' index
            start_index = open_braces[0]
            end_index = close_braces[-1]

            # Slice the JSON object from the text
            json_object = text[start_index:end_index + 1]
            json_object = json_object.strip('` \n')
            return json_object

        # Return None if no JSON object found
        return None

    def reformat_json(self, content: list, **kwargs) -> Dict:
        """Send a completion request to API."""
        message = f"""This is json object, there could be missing simbols in it and it could be
        impossible to convert from string to json, check it
        and fix it if necessary. in response return only json object.
        json object: {content}
        """
        print("Trying refactor json: ")
        response = self.client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://loreflow.app",
                "X-Title": "LoreFlow",
            },
            model=self.model,
            messages=[{"role": "user", "content": message}],
            response_format={"type": "json_object"},
            stop=['###sysmsg###', '*sysmsg*', 'sysmsg', '_sysmsg_'],
        )
        content = response.choices[0].message.content
        usage = {'completion_tokens': response.usage.completion_tokens,
                 'prompt_tokens': response.usage.prompt_tokens}
        data = {'usage': usage, 'content': content}
        return data

    def clean_response_string(self, response_string):
        # Remove outer quotes if they exist
        if response_string.startswith('"') and response_string.endswith('"'):
            response_string = response_string[1:-1]

        # Replace escaped quotes with normal quotes
        response_string = response_string.replace('\\"', '"')

        # Replace escaped backslashes with normal backslashes
        response_string = response_string.replace('\\\\', '\\')

        return response_string
