// Role-related interfaces

export interface RoleInterface {
    type: string;
    importance: string;
    dynamic_static: string;
}

export interface DemographicsInterface {
    age: string;
    gender: string;
    ethnicity: string;
    nationality: string;
}

export interface AppearanceInterface {
    physical: string;
    attire: string;
}

export interface PersonalityInterface {
    traits: string[];
    motivations: string[];
    flaws: string[];
    moral_alignment: string;
}

export interface BackstoryInterface {
    key_events: string[];
    cultural_context: string;
}

export interface RelationshipsInterface {
    name: string;
    relation: string,
    dynamic: string
}

// Main Character interface
export interface CharacterInterface {
    id: number | string;
    project: number
    name: string;
    image: string | null;
    symbolism: string;
    character_arc: string;
    aliases: string[];
    role: RoleInterface;
    demographics: DemographicsInterface;
    appearance: AppearanceInterface;
    personality: PersonalityInterface;
    backstory: BackstoryInterface;
    relationships: RelationshipsInterface[];
    additional_information: string[];
}

// Character class implementation
export class Character implements CharacterInterface {
    constructor(
        public id: number | string,
        public project: number,
        public name: string,
        public image: string | null,
        public symbolism: string = '',
        public character_arc: string = '',
        public aliases: string[],
        public role: RoleInterface,
        public demographics: DemographicsInterface,
        public appearance: AppearanceInterface,
        public personality: PersonalityInterface,
        public backstory: BackstoryInterface,
        public relationships: RelationshipsInterface[],
        public additional_information: string[],
    ) {
    }

    static from(json: CharacterInterface): Character {
        return new Character(
            json.id,
            json.project,
            json.name,
            json.image,
            json.symbolism,
            json.character_arc,
            json.aliases,
            json.role,
            json.demographics,
            json.appearance,
            json.personality,
            json.backstory,
            json.relationships,
            []
        );
    }

    // Getter for basic character info
    get basicInfo() {
        return `${this.name} (${this.demographics.nationality} ${this.role})`;
    }

    addRelationship(relationship: RelationshipsInterface) {
        this.relationships = [...this.relationships, relationship];
    }

    addAlias(alias: string) {
        this.aliases = [...this.aliases, alias];
    }

    toJSON(): CharacterInterface {
        return {
            id: this.id,
            project: this.project,
            name: this.name,
            image: this.image,
            symbolism: this.symbolism,
            character_arc: this.character_arc,
            aliases: this.aliases,
            role: this.role,
            demographics: this.demographics,
            appearance: this.appearance,
            personality: this.personality,
            backstory: this.backstory,
            relationships: this.relationships,
            additional_information: this.additional_information
        };
    }
}

export const EmptyCharacter = (): Character => {
    return Character.from({
        id: '',
        project: 0,
        name: '',
        image: null,
        symbolism: '',
        character_arc: '',
        aliases: [],
        role: {
            type: '',
            importance: '',
            dynamic_static: '',
        },
        demographics: {
            age: '',
            gender: '',
            ethnicity: '',
            nationality: '',
        },
        appearance: {
            physical: '',
            attire: '',
        },
        personality: {
            traits: [],
            motivations: [],
            flaws: [],
            moral_alignment: '',
        },
        backstory: {
            key_events: [],
            cultural_context: '',
        },
        relationships:
            [{
                name: '',
                relation: '',
                dynamic: '',
            }],
        additional_information: [],
    })
}