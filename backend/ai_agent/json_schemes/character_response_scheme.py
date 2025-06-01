character_response_scheme = {
    "character": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Character's primary name or title"
            },
            "image": {
                "type": "string",
                "description": "URL or path to character's visual representation"
            },
            "symbolism": {
                "type": "string",
                "description": "Thematic representation and meaning of the character"
            },
            "character_arc": {
                "type": "string",
                "description": "Character's developmental journey throughout the narrative"
            },
            "aliases": {
                "type": "array",
                "description": "Alternative names or titles the character is known by",
                "items": {
                    "type": "string"
                }
            },
            "role": {
                "type": "object",
                "description": "Character's function and importance in the story",
                "properties": {
                    "type": {
                        "type": "string",
                        "description": "Primary narrative role (protagonist, antagonist, "
                                       "supporting, etc.)"
                    },
                    "importance": {
                        "type": "string",
                        "description": "Level of significance in the narrative"
                    },
                    "dynamic_static": {
                        "type": "string",
                        "description": "Whether character undergoes change or remains constant"
                    }
                },
                "required": ["type", "importance", "dynamic_static"],
                "additionalProperties": False
            },
            "demographics": {
                "type": "object",
                "description": "Personal identity characteristics",
                "properties": {
                    "age": {
                        "type": "string",
                        "description": "Character's chronological age"
                    },
                    "gender": {
                        "type": "string",
                        "description": "Character's gender identity"
                    },
                    "ethnicity": {
                        "type": "string",
                        "description": "Character's ethnic background"
                    },
                    "nationality": {
                        "type": "string",
                        "description": "Character's national or cultural origin"
                    }
                },
                "required": ["age", "gender", "ethnicity", "nationality"],
                "additionalProperties": False
            },
            "appearance": {
                "type": "object",
                "description": "Physical attributes and visual elements",
                "properties": {
                    "attire": {
                        "type": "string",
                        "description": "Character's typical clothing and adornments"
                    },
                    "physical": {
                        "type": "string",
                        "description": "Notable physical characteristics and features"
                    },
                    "distinctive_features": {
                        "type": "array",
                        "description": "Unique identifiable elements of appearance",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": ["attire", "physical", "distinctive_features"],
                "additionalProperties": False
            },
            "personality": {
                "type": "object",
                "description": "Psychological and behavioral attributes",
                "properties": {
                    "flaws": {
                        "type": "array",
                        "description": "Character weaknesses and shortcomings",
                        "items": {
                            "type": "string"
                        }
                    },
                    "traits": {
                        "type": "array",
                        "description": "Defining personality characteristics",
                        "items": {
                            "type": "string"
                        }
                    },
                    "motivations": {
                        "type": "array",
                        "description": "Goals and driving forces",
                        "items": {
                            "type": "string"
                        }
                    },
                    "moral_alignment": {
                        "type": "string",
                        "description": "Character's ethical positioning and values"
                    }
                },
                "required": ["flaws", "traits", "motivations", "moral_alignment"],
                "additionalProperties": False
            },
            "backstory": {
                "type": "object",
                "description": "Character history prior to the main narrative",
                "properties": {
                    "key_events": {
                        "type": "array",
                        "description": "Formative experiences that shaped the character",
                        "items": {
                            "type": "string"
                        }
                    },
                    "cultural_context": {
                        "type": "string",
                        "description": "Social and historical background influencing the character"
                    }
                },
                "required": ["key_events", "cultural_context"],
                "additionalProperties": False
            },
            "relationships": {
                "type": "array",
                "description": "Connections to other characters",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "Name of the related character"
                        },
                        "relation": {
                            "type": "string",
                            "description": "Type of relationship between characters"
                        },
                        "dynamic": {
                            "type": "string",
                            "description": "Quality or nature of the interaction"
                        }
                    },
                    "required": ["name", "relation", "dynamic"],
                    "additionalProperties": False
                }
            },
            "additional_information": {
                "type": "object",
                "description": "Supplementary details about the character",
                "properties": {
                    "signature_ability": {
                        "type": "string",
                        "description": "Character's unique talent or capability"
                    },
                    "paradox": {
                        "type": "string",
                        "description": "Contradictory or ironic aspect of the character"
                    }
                },
                "required": ["signature_ability", "paradox"],
                "additionalProperties": False
            },
            "project": {
                "type": "string",
                "description": "Unique identifier for the project this character belongs to"
            }
        },
        "required": [
            "name",
            "image",
            "symbolism",
            "character_arc",
            "aliases",
            "role",
            "demographics",
            "appearance",
            "personality",
            "backstory",
            "relationships",
            "additional_information",
            "project"
        ],
        "additionalProperties": False
    }
}
