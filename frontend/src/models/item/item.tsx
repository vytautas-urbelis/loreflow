export interface ItemInterface {
    id: string;
    project: number;
    name: string;
    image?: string | null;
    category?: string | null;
    description?: string | null;
    symbolism?: string | null;

    properties: {
        material?: string;
        size?: string;
        appearance?: string;
        unique_traits?: string;
        [key: string]: any; // Allows for additional dynamic properties
    };

    history: {
        origin?: string;
        age?: string;
        creator?: string;
        previous_events?: string[];
        [key: string]: any; // Allows for additional dynamic history fields
    };

    abilities: {
        ability: string;
        [key: string]: any; // Allows for additional dynamic ability fields
    }[];

    ownership: {
        character: string;
        acquisition: string;
        significance: string;
        [key: string]: any; // Allows for additional dynamic ownership fields
    }[];

    significance: {
        [key: string]: any; // Flexible structure for significance fields
    };
}

// Helper function to create an empty item
export const EmptyItem = (): ItemInterface => ({
    id: '',
    project: 0,
    name: '',
    image: null,
    category: '',
    description: '',
    symbolism: '',
    properties: {},
    history: {},
    abilities: [],
    ownership: [],
    significance: {}
});
