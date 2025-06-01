import json

from mistralai import Mistral

from base.sender import send_characters_websockets
from filmai import settings

api_key = settings.MISTRAL_API_KEY
model = "ministral-8b-latest"
client = Mistral(api_key=api_key)


def base_mistral_controller(instructions, text, channel, movie_project_id):
    message = f'Instructions:{instructions}; Book: {text}'
    print(message)
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": message,
            },
        ],
        response_format={
            "type": "json_object",
        }
    )
    content_str = chat_response.choices[0].message.content
    content_to_websockets = json.loads(content_str)
    content_to_websockets['movie_project_id'] = movie_project_id

    send_characters_websockets(channel, json.dumps(content_to_websockets))
    return str(content_str)


def base_mistral_controller_stream(instructions, text, channel):
    message = f'Instructions:{instructions}; Book: {text}'
    chat_response = client.chat.stream(
        model=model,
        messages=[
            {
                "role": "user",
                "content": message,
            },
        ],
        response_format={
            "type": "json_object",
        }
    )
    for chunk in chat_response:
        if chunk.choices and chunk.choices[0].delta:
            content = chunk.choices[0].delta.content
            if content:
                if content.startswith("data: "):
                    content = content[6:]
                    send_characters_websockets(channel, f"{content}")
                if content.endswith("\n\n"):
                    content = content[:-2]
                    send_characters_websockets(channel, f"{content}")
                if content != "[DONE]":
                    send_characters_websockets(channel, f"{content}")
                yield f"data: {content}\n\n"
                # time.sleep(0.05)  # 50ms delay between chunks

        elif chunk.choices and chunk.choices[0].finish_reason:
            yield "data: [DONE]\n\n"
