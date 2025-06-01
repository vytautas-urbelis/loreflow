tools = [
    {
        "type": "function",
        "function": {
            "name": "create_characters",
            "description": "Create detailed character profiles with nested attributes.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "format": "uuid",
                        "description": "Project identifier"
                    },
                    "characters": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "minLength": 1,
                                    "maxLength": 50
                                },
                                "symbolism": {
                                    "type": "string",
                                    "maxLength": 200
                                },
                                "role": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "enum": ["major", "minor"]
                                        },
                                        "importance": {
                                            "type": "string",
                                            "enum": ["primary", "secondary", "tertiary"]
                                        },
                                        "dynamic_static": {
                                            "type": "string",
                                            "enum": ["dynamic", "static"]
                                        }
                                    },
                                    "required": ["type", "importance", "dynamic_static"]
                                },
                                "personality": {
                                    "type": "object",
                                    "properties": {
                                        "flaws": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                            "maxItems": 5
                                        },
                                        "traits": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                            "maxItems": 10
                                        },
                                        "motivations": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                            "maxItems": 3
                                        },
                                        "moral_alignment": {
                                            "type": "string",
                                            "enum": [
                                                "lawful_good", "neutral_good", "chaotic_good",
                                                "lawful_neutral", "neutral", "chaotic_neutral",
                                                "lawful_evil", "neutral_evil", "chaotic_evil"
                                            ]
                                        }
                                    },
                                    "required": ["moral_alignment"]
                                },
                                "demographics": {
                                    "type": "object",
                                    "properties": {
                                        "age": {"type": "string"},
                                        "gender": {"type": "string"},
                                        "ethnicity": {"type": "string"},
                                        "nationality": {"type": "string"}
                                    }
                                }
                            },
                            "required": ["name", "role", "personality"]
                        }
                    }
                },
                "required": ["project_id", "characters"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_items",
            "description": "Create new items for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of items to create",
                        "minimum": 1
                    },
                    "item_types": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "weapon",
                                "artifact",
                                "tool",
                                "clothing",
                                "consumable",
                                "key_item",
                                "treasure",
                                "magical_object"
                            ]
                        },
                        "description": "Types of items to create"
                    }
                },
                "required": ["project_id", "count", "item_types"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_locations",
            "description": "Create new locations for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of locations to create",
                        "minimum": 1
                    },
                    "location_types": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "castle",
                                "village",
                                "forest",
                                "mountain",
                                "dungeon",
                                "city",
                                "desert",
                                "ocean",
                                "island",
                                "cave",
                                "temple"
                            ]
                        },
                        "description": "Types of locations to create"
                    }
                },
                "required": ["project_id", "count", "location_types"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_chapters",
            "description": "Create new chapters for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "chapter_count": {
                        "type": "integer",
                        "description": "Number of chapters to create",
                        "minimum": 1
                    },
                    "structure": {
                        "type": "string",
                        "enum": [
                            "three_act",
                            "hero_journey",
                            "five_act",
                            "linear",
                            "non_linear",
                            "frame_story",
                            "episodic"
                        ],
                        "description": "Narrative structure to follow"
                    }
                },
                "required": ["project_id", "chapter_count", "structure"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_pages",
            "description": "Create new pages for a chapter.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "chapter_id": {
                        "type": "string",
                        "description": "The unique identifier for the chapter"
                    },
                    "chapter_number": {
                        "type": "integer",
                        "description": "The chapter number these pages belong to",
                        "minimum": 1
                    },
                    "scene_sequence": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "scene_type": {
                                    "type": "string",
                                    "enum": [
                                        "action",
                                        "dialogue",
                                        "exposition",
                                        "flashback",
                                        "dream_sequence",
                                        "montage",
                                        "climax"
                                    ]
                                },
                                "length": {
                                    "type": "string",
                                    "enum": ["short", "medium", "long"]
                                }
                            },
                            "required": ["scene_type", "length"],
                            "additionalProperties": False
                        },
                        "description": "Sequence of scenes to include on the pages"
                    }
                },
                "required": ["chapter_id", "chapter_number", "scene_sequence"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_scenes",
            "description": "Create new scenes for a page.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "page_id": {
                        "type": "string",
                        "description": "The unique identifier for the page"
                    },
                    "chapter_number": {
                        "type": "integer",
                        "description": "The chapter number this scene belongs to",
                        "minimum": 1
                    },
                    "scene_requirements": {
                        "type": "object",
                        "properties": {
                            "characters": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Character IDs to include in the scene"
                            },
                            "location": {
                                "type": "string",
                                "description": "Location ID where the scene takes place"
                            },
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Item IDs to include in the scene"
                            },
                            "mood": {
                                "type": "string",
                                "enum": [
                                    "tense",
                                    "joyful",
                                    "melancholic",
                                    "suspenseful",
                                    "romantic",
                                    "mysterious",
                                    "horrific"
                                ],
                                "description": "The emotional tone of the scene"
                            },
                            "time_of_day": {
                                "type": "string",
                                "enum": [
                                    "morning",
                                    "afternoon",
                                    "evening",
                                    "night",
                                    "dawn",
                                    "dusk"
                                ]
                            }
                        },
                        "required": ["characters", "location", "mood"],
                        "additionalProperties": False
                    }
                },
                "required": ["page_id", "chapter_number", "scene_requirements"],
                "additionalProperties": False
            }
        }
    }
]

toolss = [
    {
        "type": "function",
        "function": {
            "name": "create_character",
            "description": "Create detailed character profile with nested attributes.",
            "strict": True,
            "parameters": {
                "project_id": {
                    "type": "string",
                    "format": "uuid",
                    "description": "Project identifier"
                }}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_items",
            "description": "Create new items for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of items to create",
                        "minimum": 1
                    },
                    "item_types": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "weapon",
                                "artifact",
                                "tool",
                                "clothing",
                                "consumable",
                                "key_item",
                                "treasure",
                                "magical_object"
                            ]
                        },
                        "description": "Types of items to create"
                    }
                },
                "required": ["project_id", "count", "item_types"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_locations",
            "description": "Create new locations for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of locations to create",
                        "minimum": 1
                    },
                    "location_types": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "castle",
                                "village",
                                "forest",
                                "mountain",
                                "dungeon",
                                "city",
                                "desert",
                                "ocean",
                                "island",
                                "cave",
                                "temple"
                            ]
                        },
                        "description": "Types of locations to create"
                    }
                },
                "required": ["project_id", "count", "location_types"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_chapters",
            "description": "Create new chapters for a project.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "project_id": {
                        "type": "string",
                        "description": "The unique identifier for the project"
                    },
                    "chapter_count": {
                        "type": "integer",
                        "description": "Number of chapters to create",
                        "minimum": 1
                    },
                    "structure": {
                        "type": "string",
                        "enum": [
                            "three_act",
                            "hero_journey",
                            "five_act",
                            "linear",
                            "non_linear",
                            "frame_story",
                            "episodic"
                        ],
                        "description": "Narrative structure to follow"
                    }
                },
                "required": ["project_id", "chapter_count", "structure"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_pages",
            "description": "Create new pages for a chapter.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "chapter_id": {
                        "type": "string",
                        "description": "The unique identifier for the chapter"
                    },
                    "chapter_number": {
                        "type": "integer",
                        "description": "The chapter number these pages belong to",
                        "minimum": 1
                    },
                    "scene_sequence": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "scene_type": {
                                    "type": "string",
                                    "enum": [
                                        "action",
                                        "dialogue",
                                        "exposition",
                                        "flashback",
                                        "dream_sequence",
                                        "montage",
                                        "climax"
                                    ]
                                },
                                "length": {
                                    "type": "string",
                                    "enum": ["short", "medium", "long"]
                                }
                            },
                            "required": ["scene_type", "length"],
                            "additionalProperties": False
                        },
                        "description": "Sequence of scenes to include on the pages"
                    }
                },
                "required": ["chapter_id", "chapter_number", "scene_sequence"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_scenes",
            "description": "Create new scenes for a page.",
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "page_id": {
                        "type": "string",
                        "description": "The unique identifier for the page"
                    },
                    "chapter_number": {
                        "type": "integer",
                        "description": "The chapter number this scene belongs to",
                        "minimum": 1
                    },
                    "scene_requirements": {
                        "type": "object",
                        "properties": {
                            "characters": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Character IDs to include in the scene"
                            },
                            "location": {
                                "type": "string",
                                "description": "Location ID where the scene takes place"
                            },
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                },
                                "description": "Item IDs to include in the scene"
                            },
                            "mood": {
                                "type": "string",
                                "enum": [
                                    "tense",
                                    "joyful",
                                    "melancholic",
                                    "suspenseful",
                                    "romantic",
                                    "mysterious",
                                    "horrific"
                                ],
                                "description": "The emotional tone of the scene"
                            },
                            "time_of_day": {
                                "type": "string",
                                "enum": [
                                    "morning",
                                    "afternoon",
                                    "evening",
                                    "night",
                                    "dawn",
                                    "dusk"
                                ]
                            }
                        },
                        "required": ["characters", "location", "mood"],
                        "additionalProperties": False
                    }
                },
                "required": ["page_id", "chapter_number", "scene_requirements"],
                "additionalProperties": False
            }
        }
    }
]
