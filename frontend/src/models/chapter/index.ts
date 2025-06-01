// Define interface for Movie

import {CharacterInterface} from "../character/character.ts";
import {LocationInterface} from "../location/location.tsx";
import {ItemInterface} from "../item/item.tsx";
import {SceneInterface} from "../scene/scene.tsx";

export interface PageInterface {
    id: string
    text: string
    sequence: number
    characters: CharacterInterface[]
    locations: LocationInterface[]
    items: ItemInterface[]
    scenes: SceneInterface[]
}

export interface ChapterInterface {
    id: string;
    name: string;
    description: string;
    pages: PageInterface[]
    scenes: SceneInterface[]
    project: string
}

// Movie class implementation
export class Chapter implements ChapterInterface {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public pages: PageInterface[],
        public scenes: SceneInterface[],
        public project: string,
    ) {
    }

    static from(json: ChapterInterface): Chapter {
        return new Chapter(
            json.id,
            json.name,
            json.description,
            json.pages,
            json.scenes,
            json.project,
        );
    }

    toJSON(): ChapterInterface {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            pages: this.pages,
            scenes: this.scenes,
            project: this.project,
        };
    }
}

// Helper function to create an empty location
export const EmptyPage = (lastPageNumber: number): PageInterface => ({
    id: '',
    text: '',
    sequence: lastPageNumber + 1,
    characters: [],
    locations: [],
    items: [],
    scenes: []
});

// Helper function to create an empty location
export const EmptyChapter = (): ChapterInterface => ({
    id: '',
    name: '',
    description: '',
    pages: [],
    scenes: [],
    project: '',
});

