plan_response_scheme = {
    "plan_steps": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "step_number": {
                    "type": "integer",
                    "description": "The sequential number of the step"
                },
                "operation": {
                    "type": "string",
                    "description": "Name of the function/operation to execute"
                },
                "parameters": {
                    "type": "object",
                    "description": "Parameters required for the operation",
                    "properties": {
                        "project_id": {
                            "type": "string",
                            "description": "Project id provided by user or taken from project "
                                           "context, only needed "
                                           "if it is necessary for plan execution, "
                                           "otherwise undefined"
                        },
                        "chapter_id": {
                            "type": "string",
                            "description": "Chapter id provided by user or taken from chapter "
                                           "context, only needed "
                                           "if it is necessary for plan execution, "
                                           "otherwise undefined"
                        },
                        "page_id": {
                            "type": "string",
                            "description": "Page id provided by user or taken from page context, "
                                           "only needed "
                                           "if it is necessary for plan execution, "
                                           "otherwise undefined"
                        },
                        "scene_id": {
                            "type": "string",
                            "description": "Project id provided by user or taken from scene "
                                           "context, only needed "
                                           "if it is necessary for plan execution, "
                                           "otherwise undefined"
                        },
                        "title": {
                            "type": "string",
                            "description": "Scene title, only needed if it is necessary for plan "
                                           "execution, otherwise undefined"
                        },
                        "sequence": {
                            "type": "string",
                            "description": "Scene or Page sequence, depends on what instance "
                                           "being created, only needed"
                                           " if it is necessary for plan execution, "
                                           "otherwise undefined"
                        },
                        "details": {
                            "type": "string",
                            "description": "Detailed description about instance being created"
                        },
                    },
                    "required": [
                        "project_id",
                        "chapter_id",
                        "page_id",
                        "scene_id",
                        "title",
                        "sequence",
                        "details"
                    ],
                    "additionalProperties": False
                },
                "description": {
                    "type": "string",
                    "description": "Name of the instance"
                },
                "dependencies": {
                    "type": "array",
                    "description": "List of prerequisite steps",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "step_number",
                "operation",
                "parameters",
                "description",
                "dependencies"
            ],
            "additionalProperties": False
        }
    }
}
