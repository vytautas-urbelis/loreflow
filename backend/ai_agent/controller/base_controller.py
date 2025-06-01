import openai
from django.http import StreamingHttpResponse

from base.sender import send_characters_websockets
from filmai import settings


def base_controller(user_prompt, system_prompt, channel):
    response = StreamingHttpResponse(
        chat_stream_generator(user_prompt, system_prompt, channel),
        content_type='text/event-stream',
        headers={'Cache-Control': 'no-cache'}
    )
    response['Cache-Control'] = 'no-cache, no-transform'
    response['X-Accel-Buffering'] = 'no'
    response['Connection'] = 'keep-alive'
    return response


def chat_stream_generator(user_prompt, system_prompt, channel):
    try:
        client = openai.OpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url="https://api.deepseek.com",
        )

        messages = [{"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            stream=True,
            response_format={
                'type': 'json_object'
            }
        )

        for chunk in response:
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

    except Exception as e:
        print(f"API error: {str(e)}")
        yield f"data: Error calling API: {str(e)}\n\n"
        yield "data: [DONE]\n\n"
