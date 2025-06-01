import {v4 as uuidv4} from "uuid";

export interface SceneInterface {
    id: string; // Assuming each scene has a unique ID (commonly added by Django models)
    // page: string; // ForeignKey reference to the Project model (likely represented as an ID)
    chapter: string; // ForeignKey reference to the Project model (likely represented as an ID)
    project: string; // ForeignKey reference to the Project model (likely represented as an ID)
    title: string;
    sequence: number; // Nullable and optional sequence

    summary: string; // Optional summary
    content: string; // Optional content
    updated_content: string; // Optional content

    characters: { id: string }[]; // Array of character IDs (ManyToMany relationship)
    location?: { id: string } | null; // Nullable location ID (ForeignKey relationship)
    items: { id: string }[]; // Array of item IDs (ManyToMany relationship)

    time: {
        time_of_day?: string;
        date?: string;
        [key: string]: any; // Allows for additional dynamic time fields
    };

    weather: {
        condition?: string;
        description?: string;
        [key: string]: any; // Allows for additional dynamic weather fields
    };

    goals: {
        description: string;
        [key: string]: any; // Allows for additional dynamic goal fields
    }[];

    conflict: {
        description?: string;
        resolution?: string;
        [key: string]: any; // Allows for additional dynamic conflict fields
    };

    outcome: {
        description?: string;
        [key: string]: any; // Allows for additional dynamic outcome fields
    };

    mood?: string; // Optional mood
    pov?: string; // Optional point of view
    notes?: string; // Optional notes
}

// Helper function to create an empty location
export const EmptyScene = (): SceneInterface => ({
    id: uuidv4(),
    chapter: '',
    project: '',
    title: '',
    sequence: 0,
    summary: '',
    content: '',
    updated_content: '',
    characters: [],
    location: null,
    items: [],
    time: {
        time_of_day: '',
        date: '',
    },
    weather: {
        condition: '',
        description: '',
    },
    goals: [],
    conflict: {
        description: '',
        resolution: '',
    },
    outcome: {
        description: '',
    },
    mood: '',
    pov: '',
    notes: '',
});