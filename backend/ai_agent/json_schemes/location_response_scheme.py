location_response_scheme = {
    "location": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "Unique identifier for the location"
            },
            "project": {
                "type": "string",
                "description": "Project identifier this location belongs to"
            },
            "name": {
                "type": "string",
                "description": "Primary name of the location"
            },
            "image": {
                "type": "string",
                "description": "URL or path to the location's visual representation"
            },
            "description": {
                "type": "string",
                "description": "Detailed description of the location's physical characteristics"
            },
            "symbolism": {
                "type": "string",
                "description": "Thematic representation and meaning of the location"
            },
            "type": {
                "type": "string",
                "description": "Classification or category of the location"
            },
            "geography_details": {
                "type": "object",
                "description": "Physical and natural characteristics of the location",
                "properties": {
                    "terrain": {
                        "type": "string",
                        "description": "Physical features of the land"
                    },
                    "climate": {
                        "type": "string",
                        "description": "Weather patterns and atmospheric conditions"
                    },
                    "flora": {
                        "type": "string",
                        "description": "Plant life native to the location"
                    },
                    "fauna": {
                        "type": "string",
                        "description": "Animal life native to the location"
                    },
                    "natural_resources": {
                        "type": "string",
                        "description": "Valuable materials or features found naturally in the area"
                    }
                },
                "required": ["terrain", "climate", "flora", "fauna", "natural_resources"],
                "additionalProperties": False
            },
            "culture_details": {
                "type": "object",
                "description": "Social and cultural aspects of the location",
                "properties": {
                    "language": {
                        "type": "string",
                        "description": "Languages or dialects spoken in the area"
                    },
                    "customs": {
                        "type": "string",
                        "description": "Traditional practices and social norms"
                    },
                    "religion": {
                        "type": "string",
                        "description": "Spiritual beliefs and practices"
                    },
                    "social_structure": {
                        "type": "string",
                        "description": "Organization of society and power dynamics"
                    },
                    "arts": {
                        "type": "string",
                        "description": "Creative expressions and cultural artifacts"
                    }
                },
                "required": ["language", "customs", "religion", "social_structure", "arts"],
                "additionalProperties": False
            },
            "historical_events": {
                "type": "array",
                "description": "Significant events in the location's history",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Name of the historical event"
                        },
                        "date": {
                            "type": "string",
                            "description": "When the event occurred"
                        },
                        "description": {
                            "type": "string",
                            "description": "Details about what happened"
                        },
                        "significance": {
                            "type": "string",
                            "description": "Impact or importance of the event"
                        }
                    },
                    "required": ["title", "date", "description", "significance"],
                    "additionalProperties": False
                }
            },
            "points_of_interest": {
                "type": "array",
                "description": "Notable landmarks or areas within the location",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the point of interest"
                        },
                        "description": {
                            "type": "string",
                            "description": "Physical details and characteristics"
                        },
                        "significance": {
                            "type": "string",
                            "description": "Cultural or practical importance"
                        }
                    },
                    "required": ["name", "description", "significance"],
                    "additionalProperties": False
                }
            },
            "inhabitants_list": {
                "type": "array",
                "description": "Notable people or beings living in the location",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the inhabitant"
                        },
                        "role": {
                            "type": "string",
                            "description": "Position or function in the community"
                        },
                        "description": {
                            "type": "string",
                            "description": "Personal details and characteristics"
                        }
                    },
                    "required": ["name", "role", "description"],
                    "additionalProperties": False
                }
            },
            "atmosphere_details": {
                "type": "object",
                "description": "Sensory and emotional qualities of the location",
                "properties": {
                    "mood": {
                        "type": "string",
                        "description": "Emotional tone or feeling of the place"
                    },
                    "lighting": {
                        "type": "string",
                        "description": "Quality and characteristics of light"
                    },
                    "sounds": {
                        "type": "string",
                        "description": "Auditory elements of the environment"
                    },
                    "smells": {
                        "type": "string",
                        "description": "Olfactory characteristics of the location"
                    },
                    "general_feel": {
                        "type": "string",
                        "description": "Overall sensory impression and ambiance"
                    }
                },
                "required": ["mood", "lighting", "sounds", "smells", "general_feel"],
                "additionalProperties": False
            }
        },
        "required": [
            "id",
            "project",
            "name",
            "image",
            "description",
            "symbolism",
            "type",
            "geography_details",
            "culture_details",
            "historical_events",
            "points_of_interest",
            "inhabitants_list",
            "atmosphere_details"
        ],
        "additionalProperties": False
    }
}
