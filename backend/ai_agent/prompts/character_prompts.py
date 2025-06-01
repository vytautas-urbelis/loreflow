from typing import Dict


def generate_character_system_prompt(characters: Dict = None) -> str:
    """Generate the system prompt for character extraction."""
    characters = characters or {}

    # Example character JSON format
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
    "physical": "pale complexion, waist-length black hair, sharp green eyes, a jagged scar
    across her left cheek",
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
"character_arc": "Begins as a vengeful outcast, evolves into a tyrannical ruler, ultimately
sacrifices herself to break the curse she created"
}
]
}"""

    return f"""
You are given part of the story.

Extract all of the characters who participate in the narrative.

important: you need to extract all characters, not few of them.
important: you don't ask questions and don't write anything else except json of characters.

Response Requirements:
Return a JSON object with metadata and a characters array.
Your entire response/output is going to consist of a single JSON object, and you will NOT
wrap it within JSON md markers”
Do not use prompt catch, allways give fresh answer.
For each character, include the following fields:

Core Identity

1. name (string): The character's full name (e.g., "Eleanor Voss")
2. role (object):
    - type (string): Their function in the story (e.g., "narrator", "protagonist", "antagonist",
    "mentor", "ally", "sidekick", "villain")
    - importance (string): "primary" "secondary", "minor", "background"
    - dynamic_static (string): Whether they change throughout the story ("dynamic") or remain the
    same ("static") or ("round"): Complex, well-developed characters with multiple dimensions
    (though this typically describes character complexity rather than change) or ("flat"):
    One-dimensional characters with limited traits (similar to "static" but focused on complexity)
    or ("stock"): Archetypal characters with fixed personality traits or ("Symbolic"): Characters
    representing concepts or themes larger than themselves.
3. demographics (object):
    - age (string): Exact age or approximate description (e.g., "late 40s")
    - gender (string): Male/female/non-binary/other
    - ethnicity (string): Character's ethnic background if specified
    - nationality (string): Character's national origin if specified
4. Appearance (object):
    - physical (string): A detailed description of physical traits (e.g., "pale complexion,
    waist-length black hair, sharp green eyes")
    - attire (string): Clothing and accessories typically worn
5. Personality (object):
    - traits (array): List of key personality characteristics
    - motivations (array): Character's goals, desires, and driving forces
    - flaws (array): Character weaknesses or negative traits
    - moral_alignment (string): General moral stance (e.g., "neutral evil," "chaotic good")
6. Backstory (object):
    - key_events (array): Important past events that shaped the character
    - cultural_context (string): Social or cultural background information
7. Relationships (array of objects):
    - name (string): Name of the related character
    - relation (string): Type of relationship (e.g., "brother," "mentor," "enemy")
    - dynamic (string): Nature of their interaction
8. Aliases (array): Any nicknames or alternative names (e.g., ["The Raven Queen"])
9. Symbolism (string): What the character represents thematically
10. character_arc (string): Description of how the character changes throughout the story

Rules:

- If details are missing, use "unknown" for string fields or empty arrays ([]) for array fields.
Do not assume unspecified traits.
- Include the story_title and author in the metadata object if available.
- Prioritize precision and specificity in descriptions.
- In the response include only the complete JSON object, no other words, explanations,
or questions.

if you find something to update previous extracted characters, update characters.
Return full list of characters, found previously, updated, and new characters

Example Response:
{character_json_example}

Previous extracted characters:
{characters}
"""
