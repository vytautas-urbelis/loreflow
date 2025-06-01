page_response_scheme = {
    "page": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "description": "Unique identifier for the scene"
            },
            "chapter": {
                "type": "string",
                "description": "Unique identifier for the chapter this page belongs to"
            },
            "text": {
                "type": "string",
                "description": "Narrative text or content of the page"
            },
            "sequence": {
                "type": "integer",
                "description": "Order of the page within the chapter"
            },

        },
        "required": [
            "id",
            "chapter",
            "text",
            "sequence",
        ],
        "additionalProperties": False
    }
}
