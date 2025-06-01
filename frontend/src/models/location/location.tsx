export interface LocationInterface {
    id: string;
    project: number;
    name: string;
    image?: string | null;
    description?: string;
    symbolism?: string;
    type?: string;

    geography_details: {
        terrain?: string;
        climate?: string;
        flora?: string;
        fauna?: string;
        natural_resources?: string;
        [key: string]: any; // Allows for additional dynamic geography fields
    };

    culture_details: {
        language?: string;
        customs?: string;
        religion?: string;
        social_structure?: string;
        arts?: string;
        [key: string]: any; // Allows for additional dynamic culture fields
    };

    historical_events: {
        title: string;
        date: string;
        description: string;
        significance: string;
        [key: string]: any; // Allows for additional dynamic event fields
    }[];

    points_of_interest: {
        name: string;
        description: string;
        significance: string;
        [key: string]: any; // Allows for additional dynamic POI fields
    }[];

    inhabitants_list: {
        name: string;
        role: string;
        description: string;
        [key: string]: any; // Allows for additional dynamic inhabitant fields
    }[];

    atmosphere_details: {
        mood?: string;
        lighting?: string;
        sounds?: string;
        smells?: string;
        general_feel?: string;
        [key: string]: any; // Allows for additional dynamic atmosphere fields
    };
}

// Helper function to create an empty location
export const EmptyLocation = (): LocationInterface => ({
    id: '',
    project: 0,
    name: '',
    image: null,
    description: '',
    symbolism: '',
    type: '',
    geography_details: {},
    culture_details: {},
    historical_events: [],
    points_of_interest: [],
    inhabitants_list: [],
    atmosphere_details: {}
});