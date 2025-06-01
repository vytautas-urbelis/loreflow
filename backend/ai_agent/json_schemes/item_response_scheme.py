item_response_scheme = {
    "item": {
        "type": "object",
        "properties": {
            "project": {
                "type": "string",
                "description": "Unique identifier for the project this item belongs to"
            },
            "name": {
                "type": "string",
                "description": "Primary name or title of the item"
            },
            "image": {
                "type": "string",
                "description": "URL or path to the item's visual representation"
            },
            "category": {
                "type": "string",
                "description": "Classification or type of the item"
            },
            "description": {
                "type": "string",
                "description": "Detailed physical description of the item"
            },
            "symbolism": {
                "type": "string",
                "description": "Thematic representation and meaning of the item"
            },
            "properties": {
                "type": "object",
                "description": "Physical attributes and characteristics",
                "properties": {
                    "material": {
                        "type": "string",
                        "description": "Primary substance the item is made from"
                    },
                    "size": {
                        "type": "string",
                        "description": "Physical dimensions or scale of the item"
                    },
                    "appearance": {
                        "type": "string",
                        "description": "Visual details and aesthetic qualities"
                    },
                    "unique_traits": {
                        "type": "string",
                        "description": "Distinctive physical features or behaviors"
                    }
                },
                "required": ["material", "size", "appearance", "unique_traits"],
                "additionalProperties": False
            },
            "history": {
                "type": "object",
                "description": "Background and timeline of the item",
                "properties": {
                    "origin": {
                        "type": "string",
                        "description": "How and where the item was created"
                    },
                    "age": {
                        "type": "string",
                        "description": "Chronological age or time period of creation"
                    },
                    "creator": {
                        "type": "string",
                        "description": "Individual or entity that made the item"
                    },
                    "previous_events": {
                        "type": "array",
                        "description": "Significant historical moments involving the item",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": ["origin", "age", "creator", "previous_events"],
                "additionalProperties": False
            },
            "abilities": {
                "type": "array",
                "description": "Powers or special capabilities of the item",
                "items": {
                    "type": "object",
                    "properties": {
                        "ability": {
                            "type": "string",
                            "description": "Description of a specific power or capability"
                        }
                    },
                    "required": ["ability"],
                    "additionalProperties": False
                }
            },
            "ownership": {
                "type": "array",
                "description": "Characters who have possessed the item",
                "items": {
                    "type": "object",
                    "properties": {
                        "character": {
                            "type": "string",
                            "description": "Name of the character who owned the item"
                        },
                        "acquisition": {
                            "type": "string",
                            "description": "How the character obtained the item"
                        },
                        "significance": {
                            "type": "string",
                            "description": "Importance of the item to this character"
                        }
                    },
                    "required": ["character", "acquisition", "significance"],
                    "additionalProperties": False
                }
            },
            "significance": {
                "type": "object",
                "description": "Narrative importance and thematic role",
                "properties": {
                    "plot_relevance": {
                        "type": "string",
                        "description": "How the item impacts the story's plot"
                    },
                    "story_function": {
                        "type": "string",
                        "description": "Narrative purpose the item serves"
                    },
                    "symbolic_meaning": {
                        "type": "string",
                        "description": "Deeper thematic significance of the item"
                    }
                },
                "required": ["plot_relevance", "story_function", "symbolic_meaning"],
                "additionalProperties": False
            }
        },
        "required": [
            "project",
            "name",
            "image",
            "category",
            "description",
            "symbolism",
            "properties",
            "history",
            "abilities",
            "ownership",
            "significance"
        ],
        "additionalProperties": False
    }
}
