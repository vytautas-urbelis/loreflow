# import asyncio
# from mistralai import Mistral
# import os
#
#
# async def stream_mistral_response_async(prompt, model="mistral-small-latest", api_key=None):
#     """
#     Make an asynchronous streaming API call to Mistral AI.
#
#     Args:
#         prompt (str): The user prompt to send to the model
#         model (str): The Mistral model to use (default: mistral-small-latest)
#         api_key (str, optional): Mistral AI API key. If None, uses MISTRAL_API_KEY environment variable
#
#     Returns:
#         Asynchronous generator yielding response chunks
#     """
#     # Get API key from environment variable if not provided
#     if api_key is None:
#         api_key = os.environ.get("FtQUvkCSjd8SNE9Huy6L1Qtsm1abCAh1")
#         if not api_key:
#             raise ValueError("No API key provided. Set MISTRAL_API_KEY environment variable or pass api_key parameter.")
#
#     # Initialize async Mistral client
#     async with Mistral(api_key=api_key) as client:
#         # Format messages
#         messages = {"message": prompt}
#
#         # Make streaming API call
#         stream_response = await client.chat_stream(
#             model=model,
#             messages=messages
#         )
#
#         # Yield from async generator
#         async for chunk in stream_response:
#             yield chunk.choices[0].delta.content

import os
import asyncio
from mistralai import Mistral


async def stream_mistral_response_async(prompt, model="mistral-small-latest", api_key=None):
    """
    Make an asynchronous streaming API call to Mistral AI using the latest client library.

    Args:
        prompt (str): The user prompt to send to the model
        model (str): The Mistral model to use (default: mistral-small-latest)
        api_key (str, optional): Mistral AI API key. If None, uses MISTRAL_API_KEY environment variable

    Yields:
        Chunks of the generated text as they are received
    """
    # Get API key from environment variable if not provided
    if api_key is None:
        api_key = "FtQUvkCSjd8SNE9Huy6L1Qtsm1abCAh1"
        if not api_key:
            raise ValueError("No API key provided. Set MISTRAL_API_KEY environment variable or pass api_key parameter.")

    # Initialize Mistral client
    client = Mistral(api_key=api_key)

    # Prepare the message
    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    # Make streaming API call
    stream_response = await client.chat.complete_async(
        model=model,
        messages=messages,
        stream=True
    )

    # Process streaming response
    async for chunk in stream_response:
        if hasattr(chunk, 'choices') and chunk.choices and hasattr(chunk.choices[0], 'delta') and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


async def main():
    prompt = "Explain quantum computing in simple terms."
    print("Response: ", end="", flush=True)
    async for text_chunk in stream_mistral_response_async(prompt):
        print(text_chunk, end="", flush=True)
    print()  # Add a newline at the end

if __name__ == "__main__":
    asyncio.run(main())