"""Utilities for handling streaming responses."""


def process_streaming_chunk(chunk: str) -> str:
    """Process a streaming chunk to clean formatting."""
    if chunk.startswith("data: "):
        chunk = chunk[6:]
    if chunk.endswith("\n\n"):
        chunk = chunk[:-2]
    return chunk


def accumulate_json_from_stream(stream_generator) -> dict:
    """Accumulate JSON content from a stream generator."""
    import json

    accumulated_content = ""
    for chunk in stream_generator:
        # Extract content from chunk if it's not a string
        if hasattr(chunk, 'choices') and chunk.choices:
            if chunk.choices[0].delta and chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                print(content)
            else:
                continue
        else:
            content = chunk
            print(content)

        # Process the content
        if isinstance(content, str):
            clean_content = process_streaming_chunk(content)
            if clean_content != "[DONE]":
                accumulated_content += clean_content

    # Parse the complete JSON at the end
    try:
        return json.loads(accumulated_content)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return {"error": str(e)}
