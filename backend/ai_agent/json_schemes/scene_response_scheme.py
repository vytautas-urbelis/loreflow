scene_response_scheme = {
    "scene": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "Unique identifier for the scene"
            },
            "title": {
                "type": "string",
                "description": "Descriptive title of the scene. Max length is 250 characters"
            },
            "sequence": {
                "type": "integer",
                "description": "Order of the scene within the narrative"
            },
            "page": {
                "type": "string",
                "description": "Unique identifier for the page this scene belongs to"
            },
            "summary": {
                "type": "string",
                "description": "Brief overview of the scene's main events"
            },
            "content": {
                "type": "string",
                "description": "Full narrative text or script of the scene"
            },
            "characters": {
                "type": "array",
                "description": "List of character references appearing in the scene, can "
                               "be added only in project existing characters",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier of the character"
                        }
                    },
                    "required": ["id"],
                    "additionalProperties": False
                }
            },
            "location": {
                "type": "object",
                "description": "Reference to the scene's location, can be added only in "
                               "project existing location",
                "properties": {
                    "id": {
                        "type": "string",
                        "description": "Unique identifier for the location"
                    }
                },
                "required": ["id"],
                "additionalProperties": False
            },
            "items": {
                "type": "array",
                "description": "List of item references present or relevant in the scene, "
                               "can be added only in project existing items",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier of the item"
                        }
                    },
                    "required": ["id"],
                    "additionalProperties": False
                }
            },
            "time": {
                "type": "object",
                "description": "Temporal context of the scene",
                "properties": {
                    "time_of_day": {
                        "type": "string",
                        "description": "Part of the day during which the scene occurs"
                    },
                    "date": {
                        "type": "string",
                        "description": "Calendar date of the scene (YYYY-MM-DD)"
                    }
                },
                "required": ["time_of_day", "date"],
                "additionalProperties": False
            },
            "weather": {
                "type": "object",
                "description": "Weather conditions during the scene",
                "properties": {
                    "condition": {
                        "type": "string",
                        "description": "Short description of weather (e.g., Stormy, Clear)"
                    },
                    "description": {
                        "type": "string",
                        "description": "Detailed description of the weather's impact"
                    }
                },
                "required": ["condition", "description"],
                "additionalProperties": False
            },
            "goals": {
                "type": "array",
                "description": "List of goals or objectives for characters in the scene",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {
                            "type": "string",
                            "description": "Goal or objective description"
                        }
                    },
                    "required": ["description"],
                    "additionalProperties": False
                }
            },
            "conflict": {
                "type": "object",
                "description": "Central conflict and its resolution in the scene",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "Nature of the conflict"
                    },
                    "resolution": {
                        "type": "string",
                        "description": "How the conflict is resolved"
                    }
                },
                "required": ["description", "resolution"],
                "additionalProperties": False
            },
            "outcome": {
                "type": "object",
                "description": "Result or consequence of the scene's events",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "Summary of the outcome"
                    }
                },
                "required": ["description"],
                "additionalProperties": False
            },
            "mood": {
                "type": "string",
                "description": "Atmosphere or emotional tone of the scene. Max length is "
                               "250 characters",
            },
            "pov": {
                "type": "string",
                "description": "Point of view character for the scene. Max length is "
                               "250 characters",
            },
            "notes": {
                "type": "string",
                "description": "Additional notes or instructions for the scene"
            }
        },
        "required": [
            "id",
            "title",
            "sequence",
            "page",
            "summary",
            "content",
            "characters",
            "location",
            "items",
            "time",
            "weather",
            "goals",
            "conflict",
            "outcome",
            "mood",
            "pov",
            "notes"
        ],
        "additionalProperties": False
    }
}
