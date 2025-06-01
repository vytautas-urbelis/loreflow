// Define interface for Movie
import {CharacterInterface} from "../character/character.ts";
import {BookInterface} from "../book/book.ts";
import {ChapterInterface} from "../chapter";
import {ItemInterface} from "../item/item.tsx";
import {LocationInterface} from "../location/location.tsx";
import {SceneInterface} from "../scene/scene.tsx";

export interface ProjectInterface {
    id: string;
    title: string;
    description: string;
    book: BookInterface[];
    createdAt: string;
    updatedAt: string;
    image: string;
    characters: CharacterInterface[]
    characters_json: CharacterInterface[]
    chapters: ChapterInterface[];
    items: ItemInterface[]
    items_json: ItemInterface[]
    locations: LocationInterface[];
    locations_json: LocationInterface[];
    scenes: SceneInterface[];
    scenes_json: SceneInterface[];
}

// Movie class implementation
export class Project implements ProjectInterface {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public book: BookInterface[],
        public createdAt: string,
        public updatedAt: string,
        public image: string,
        public characters: CharacterInterface[],
        public characters_json: CharacterInterface[],
        public chapters: ChapterInterface[],
        public items: ItemInterface[],
        public items_json: ItemInterface[],
        public locations: LocationInterface[],
        public locations_json: LocationInterface[],
        public scenes: SceneInterface[],
        public scenes_json: SceneInterface[],
    ) {
        // Public properties are automatically assigned in TypeScript
    }

    static from(json: ProjectInterface): Project {
        return new Project(
            json.id,
            json.title,
            json.description,
            json.book,
            json.createdAt,
            json.updatedAt,
            json.image,
            json.characters,
            json.characters_json,
            json.chapters,
            json.items,
            json.items_json,
            json.locations,
            json.locations_json,
            json.scenes,
            json.scenes_json,
        );
    }

    addCharacter(character: CharacterInterface) {
        this.characters = [...this.characters, character];
    }

    removeCharacterFromJson(name: string) {
        this.characters_json = this.characters_json.filter(character => character.name !== name);
    }

    addItem(item: ItemInterface) {
        this.items = [...this.items, item];
    }

    removeItemFromJson(name: string) {
        this.items_json = this.items_json.filter(item => item.name !== name);
    }

    addLocation(location: LocationInterface) {
        this.locations = [...this.locations, location];
    }

    removeLocationFromJson(name: string) {
        this.locations_json = this.locations_json.filter(location => location.name !== name);
    }

    // Getter that returns formatted movie info
    get movieInfo() {
        return `id:${this.id}; ${this.title}: ${this.description}`
    }

    toJSON(): ProjectInterface {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            book: this.book,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            image: this.image,
            characters: this.characters,
            characters_json: this.characters_json,
            chapters: this.chapters,
            items: this.items,
            items_json: this.items_json,
            locations: this.locations,
            locations_json: this.locations_json,
            scenes: this.scenes,
            scenes_json: this.scenes_json,
        };
    }
}

