import json

from ai_agent.controller.base_controller import base_controller
from ai_agent.controller.base_mistral_controller import base_mistral_controller, \
    base_mistral_controller_stream

character_json_example = """{
    "metadata": {
    "story_title": "The Shadow of the Raven",
"author": "Unknown"
},
"characters": [
{
    "name": "Eleanor Voss",
"aliases": ["The Raven Queen"],
"role": {
    "type": "antagonist",
"importance": "primary",
"dynamic_static": "dynamic"
},
"demographics": {
    "age": "late 40s",
"gender": "female",
"ethnicity": "unknown",
"nationality": "Valerian"
},
"appearance": {
    "physical": "pale complexion, waist-length black hair, sharp green eyes,
    a jagged scar across her left cheek",
"attire": "wears a crimson cloak embroidered with raven feathers, carries an ebony walking stick"
},
"personality": {
    "traits": ["calculating", "charismatic", "ruthless", "secretly remorseful"],
"motivations": ["seeking immortality", "avenging her family's massacre"],
"flaws": ["obsessive", "trusts no one"],
"moral_alignment": "neutral evil"
},
"backstory": {
    "key_events": [
"Witnessed her family's murder at age 12",
"Trained in dark magic by the exiled Order of Shadows"
],
"cultural_context": "Descendant of a disgraced noble house"
},
"relationships": [
{
    "name": "Liam Voss",
"relation": "younger brother",
"dynamic": "protective yet resentful"
}
],
"symbolism": "Represents the corruption of power and the cycle of vengeance",
"character_arc": "Begins as a vengeful outcast, evolves into a tyrannical ruler,
ultimately sacrifices herself to break the curse she created"
}
]
}"""


def system_prompt_generator(characters):
    return f"""
You are given part of the story.

Extract all of the characters who participate in the narrative.

important: you need to extract all characters, not few of them.
important: you don't ask questions and don't write anything else except json of characters.

Response Requirements:
Return a JSON object with metadata and a characters array.
For each character, include the following fields:

1. Core Identity
- name (string): The character's full name (e.g., "Eleanor Voss")
- role (object):
- type (string): Their function in the story (e.g., "protagonist," "antagonist," "mentor")
- importance (string): "primary," "secondary," or "minor"
- dynamic_static (string): Whether they change throughout the story ("dynamic") or remain the
same ("static")
- demographics (object):
- age (string): Exact age or approximate description (e.g., "late 40s")
- gender (string): Male/female/non-binary/other
- ethnicity (string): Character's ethnic background if specified
- nationality (string): Character's national origin if specified

2. Appearance (object):
- physical (string): A detailed description of physical traits (e.g., "pale complexion,
waist-length black hair, sharp green eyes")
- attire (string): Clothing and accessories typically worn

3. Personality (object):
- traits (array): List of key personality characteristics
- motivations (array): Character's goals, desires, and driving forces
- flaws (array): Character weaknesses or negative traits
- moral_alignment (string): General moral stance (e.g., "neutral evil," "chaotic good")

4. Backstory (object):
- key_events (array): Important past events that shaped the character
- cultural_context (string): Social or cultural background information

5. Relations:

Relationships (array of objects):
- name (string): Name of the related character
- relation (string): Type of relationship (e.g., "brother," "mentor," "enemy")
- dynamic (string): Nature of their interaction

Aliases (array): Any nicknames or alternative names (e.g., ["The Raven Queen"])

6. Symbolism (string): What the character represents thematically
7. character_arc (string): Description of how the character changes throughout the story

Rules:
- If details are missing, use "unknown" for string fields or empty arrays ([]) for array fields.
Do not assume unspecified traits.
- Include the story_title and author in the metadata object if available.
- Prioritize precision and specificity in descriptions.
- In the response include only the complete JSON object, no other words, explanations,
or questions.

if you find something to update previous extracted characters, update characters.
Return full list of characters, found previously, updated, amd new characters

Example Response:
{character_json_example}

Previous extracted characters:
{characters}

"""


def character_controller(part_of_book, channel, characters):
    system_prompt = system_prompt_generator(characters)
    print(system_prompt)
    streaming_response = base_controller(part_of_book, system_prompt, channel)

    # Extract the actual character data from the streaming response
    accumulated_json = ""
    for chunk in streaming_response.streaming_content:
        if chunk:
            # Remove the "data: " prefix and "\n\n" suffix if present
            content = chunk.decode('utf-8')
            if content.startswith("data: "):
                content = content[6:]
            if content.endswith("\n\n"):
                content = content[:-2]
            # Don't add the [DONE] marker to our JSON
            if content != "[DONE]":
                accumulated_json += content

    # Parse the escaped JSON string
    # parsed_json = json.loads(accumulated_json)

    # Pretty-print the JSON with proper indentation
    # pretty_json = json.dumps(parsed_json, indent=4)

    # Now you have properly formatted JSON
    # print(pretty_json)
    # Return the accumulated JSON string
    return json.loads(accumulated_json)


def character_controller_mistral(part_of_book, channel, characters, movie_project_id):
    system_prompt = system_prompt_generator(characters)
    # print(system_prompt)
    response = base_mistral_controller(system_prompt, part_of_book, channel, movie_project_id)

    # Extract the actual character data from the streaming response

    return json.loads(response)


def character_controller_mistral_stream(part_of_book, channel, characters):
    system_prompt = system_prompt_generator(characters)
    print(system_prompt)

    # Get the generator from base function
    stream_generator = base_mistral_controller_stream(system_prompt, part_of_book, channel)

    # Accumulate JSON content
    accumulated_json = ""
    for chunk in stream_generator:
        # chunk is already clean content from the generator
        accumulated_json += chunk

    # Parse the complete JSON at the end
    try:
        return json.loads(accumulated_json)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return {}
