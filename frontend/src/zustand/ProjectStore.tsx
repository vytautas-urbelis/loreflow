import {create} from 'zustand';
import {ProjectInterface} from "../models/project";
import {CharacterInterface} from "../models/character/character";
// @ts-ignore
import {merge} from 'lodash';
import {ItemInterface} from "../models/item/item";
import {LocationInterface} from "../models/location/location";
import {SceneInterface} from "../models/scene/scene";
import {ChapterInterface} from "../models/chapter";
// import {subscribeWithSelector} from "zustand/middleware/subscribeWithSelector.d.ts";

// Define the store state and actions interface
interface Index {
    projectsList: ProjectInterface[];
    currentRequestId: string

    // Project operations
    saveProjectsList: (projects: ProjectInterface[]) => void;
    addProject: (project: ProjectInterface) => void;
    updateProjectInList: (project: ProjectInterface) => void;

    // Character operations
    updateCharacterInProject: (projectId: string | number, character: CharacterInterface) => void;
    addCharacterToProject: (projectId: string | number, character: CharacterInterface) => void;
    deleteCharacterFromProject: (projectId: string | number, character: CharacterInterface) => void;
    deleteCharacterFromProjectJson: (projectId: string | number, character: CharacterInterface) => void;
    addMergeExtractedCharacter: (projectId: string | number, character: CharacterInterface) => void;

    // Item operations
    updateItemInProject: (projectId: string | number, item: ItemInterface) => void;
    addItemToProject: (projectId: string | number, item: ItemInterface) => void;
    deleteItemFromProject: (projectId: string | number, item: ItemInterface) => void;
    deleteItemFromProjectJson: (projectId: string | number, item: ItemInterface) => void;
    addMergeExtractedItem: (projectId: string | number, item: ItemInterface) => void;

    // Location operations
    updateLocationInProject: (projectId: string | number, location: LocationInterface) => void;
    addLocationToProject: (projectId: string | number, location: LocationInterface) => void;
    deleteLocationFromProject: (projectId: string | number, location: LocationInterface) => void;
    deleteLocationFromProjectJson: (projectId: string | number, location: LocationInterface) => void;
    addMergeExtractedLocation: (projectId: string | number, location: LocationInterface) => void;

    // Scene operations
    updateSceneInChapter: (projectId: string, chapterId: string, scene: SceneInterface) => void;
    streamToNewScene: (projectId: string, chapterId: string, sceneId: string, message: string) => void;
    streamToExistingScene: (projectId: string, chapterId: string, sceneId: string, message: string, request_id: string) => void;
    addSceneToChapter: (projectId: string | number, chapterId: string, scene: SceneInterface) => void;
    deleteSceneFromProject: (projectId: string | number, scene: SceneInterface) => void;
    deleteSceneFromProjectJson: (projectId: string | number, scene: SceneInterface) => void;
    addMergeExtractedScene: (projectId: string | number, scene: SceneInterface) => void;

    // Chapter operations
    updateChapterInProject: (projectId: string | number, chapter: ChapterInterface) => void;
    addChapterToProject: (projectId: string | number, chapter: ChapterInterface) => void;
    deleteChapterFromProject: (projectId: string | number, chapter: ChapterInterface) => void;
}

// Create the Zustand store
const useProjectsStore = create<Index>((set) => ({
        projectsList: [],
        currentRequestId: '',

        // Project operations
        saveProjectsList: (projects) => set({projectsList: projects}),

        addProject: (project) => set((state) => {
            return {projectsList: [...state.projectsList, project]};
        }),

        updateProjectInList: (project) => set((state) => ({
            projectsList: state.projectsList.map(item =>
                item.id === project.id ? {...item, ...project} : item
            )
        })),

        // Character operations
        updateCharacterInProject: (projectId, character) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        characters: project.characters.map(char =>
                            char.id === character.id ? {...char, ...character} : char
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addCharacterToProject: (projectId, character) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        characters: [...project.characters, character]
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteCharacterFromProject: (projectId, character) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        characters: project.characters.filter(char => char.id !== character.id)
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteCharacterFromProjectJson: (projectId, character) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        characters_json: project.characters_json.filter(char =>
                            char.name.toLowerCase() !== character.name.toLowerCase()
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addMergeExtractedCharacter: (projectId, character) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    const existingCharIndex = project.characters_json.findIndex(
                        char => char.name.toLowerCase() === character.name.toLowerCase()
                    );

                    let updated_characters_json = [...project.characters_json];

                    if (existingCharIndex !== -1) {
                        const mergedChar = merge({}, project.characters_json[existingCharIndex], character);
                        updated_characters_json = [
                            ...project.characters_json.filter(char =>
                                char.name.toLowerCase() !== character.name.toLowerCase()
                            ),
                            mergedChar
                        ];
                    } else {
                        updated_characters_json.push(character);
                    }
                    return {
                        ...project,
                        characters_json: updated_characters_json
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        // Item operations
        updateItemInProject: (projectId, item) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        items: project.items.map(it =>
                            it.id === item.id ? {...it, ...item} : it
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addItemToProject: (projectId, item) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        items: [...project.items, item]
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteItemFromProject: (projectId, item) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        items: project.items.filter(it => it.id !== item.id)
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteItemFromProjectJson: (projectId, item) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        items_json: project.items_json.filter(it =>
                            it.name.toLowerCase() !== item.name.toLowerCase()
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addMergeExtractedItem: (projectId, item) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    const existingItemIndex = project.items_json.findIndex(
                        it => it.name.toLowerCase() === item.name.toLowerCase()
                    );

                    let updated_items_json = [...project.items_json];

                    if (existingItemIndex !== -1) {
                        const mergedItem = merge({}, project.items_json[existingItemIndex], item);
                        updated_items_json = [
                            ...project.items_json.filter(it =>
                                it.name.toLowerCase() !== item.name.toLowerCase()
                            ),
                            mergedItem
                        ];
                    } else {
                        updated_items_json.push(item);
                    }
                    return {
                        ...project,
                        items_json: updated_items_json
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        // Location operations
        updateLocationInProject: (projectId, location) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        locations: project.locations.map(loc =>
                            loc.id === location.id ? {...loc, ...location} : loc
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addLocationToProject: (projectId, location) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        locations: [...project.locations, location]
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteLocationFromProject: (projectId, location) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        locations: project.locations.filter(loc => loc.id !== location.id)
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteLocationFromProjectJson: (projectId, location) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        locations_json: project.locations_json.filter(loc =>
                            loc.name.toLowerCase() !== location.name.toLowerCase()
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addMergeExtractedLocation: (projectId, location) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    const existingLocIndex = project.locations_json.findIndex(
                        loc => loc.name.toLowerCase() === location.name.toLowerCase()
                    );

                    let updated_locations_json = [...project.locations_json];

                    if (existingLocIndex !== -1) {
                        const mergedLocation = merge({}, project.locations_json[existingLocIndex], location);
                        updated_locations_json = [
                            ...project.locations_json.filter(loc =>
                                loc.name.toLowerCase() !== location.name.toLowerCase()
                            ),
                            mergedLocation
                        ];
                    } else {
                        updated_locations_json.push(location);
                    }

                    return {
                        ...project,
                        locations_json: updated_locations_json
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        // Scene operations
        updateSceneInChapter: (projectId, chapterId, scene) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id === projectId) {
                    const updatedChapters = project.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                            const updatedScenes = chapter.scenes.map(sce => sce.id === scene.id ? scene : sce)
                            // const updatedScenes = chapter.scenes.map(sce => {
                            //     if (sce.id === sceneId) {
                            //
                            //         if (state.currentRequestId !== request_id) {
                            //             state.currentRequestId = request_id;
                            //             return {
                            //                 ...sce,
                            //                 updated_content: '' + message
                            //             };
                            //         }
                            //
                            //         return {
                            //             ...sce,
                            //             updated_content: sce.updated_content + message
                            //         };
                            //     }
                            //     return sce;
                            // });
                            console.log('updatedScenes', updatedScenes)

                            return {
                                ...chapter,
                                scenes: updatedScenes
                            };
                        }
                        return chapter;
                    });

                    return {
                        ...project,
                        chapters: updatedChapters
                    };
                }
                return project;
            });
            console.log('updatedList', updatedList)
            return {projectsList: updatedList};
        }),

        streamToExistingScene: (projectId, chapterId, sceneId, message, request_id) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id === projectId) {
                    const updatedChapters = project.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                            const updatedScenes = chapter.scenes.map(sce => {
                                if (sce.id === sceneId) {

                                    if (state.currentRequestId !== request_id) {
                                        state.currentRequestId = request_id;
                                        return {
                                            ...sce,
                                            updated_content: '' + message
                                        };
                                    }

                                    return {
                                        ...sce,
                                        updated_content: sce.updated_content + message
                                    };
                                }
                                return sce;
                            });

                            return {
                                ...chapter,
                                scenes: updatedScenes
                            };
                        }
                        return chapter;
                    });

                    return {
                        ...project,
                        chapters: updatedChapters
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        streamToNewScene: (projectId, chapterId, sceneId, message) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id === projectId) {
                    const updatedChapters = project.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                            const updatedScenes = chapter.scenes.map(sce => {
                                if (sce.id === sceneId) {
                                    return {
                                        ...sce,
                                        content: sce.content + message
                                    };
                                }
                                return sce;
                            });

                            return {
                                ...chapter,
                                scenes: updatedScenes
                            };
                        }
                        return chapter;
                    });

                    return {
                        ...project,
                        chapters: updatedChapters
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),


        addSceneToChapter: (projectId, chapterId, scene) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id === projectId) {
                    // Update chapters
                    const updatedChapters = project.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                            return {
                                ...chapter,
                                scenes: [...chapter.scenes, scene]
                            };
                        }
                        return chapter;
                    });

                    return {
                        ...project,
                        chapters: updatedChapters
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteSceneFromProject: (projectId, scene) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        scenes: project.scenes.filter(sce => sce.id !== scene.id)
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteSceneFromProjectJson: (projectId, scene) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        scenes_json: project.scenes_json.filter(sce =>
                            sce.title.toLowerCase() !== scene.title.toLowerCase()
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addMergeExtractedScene: (projectId, scene) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    const existingSceneIndex = project.scenes_json.findIndex(
                        sce => sce.title.toLowerCase() === scene.title.toLowerCase()
                    );

                    let updated_scenes_json = [...project.scenes_json];

                    if (existingSceneIndex !== -1) {
                        // Fixed the bug from original code (using location instead of scene)
                        const mergedScene = merge({}, project.scenes_json[existingSceneIndex], scene);
                        updated_scenes_json = [
                            ...project.scenes_json.filter(sce =>
                                sce.title.toLowerCase() !== scene.title.toLowerCase()
                            ),
                            mergedScene
                        ];
                    } else {
                        updated_scenes_json.push(scene);
                    }

                    return {
                        ...project,
                        scenes_json: updated_scenes_json
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        // Chapter operations
        updateChapterInProject: (projectId, chapter) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        chapters: project.chapters.map(chap =>
                            chap.id === chapter.id ? {...chap, ...chapter} : chap
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        addChapterToProject: (projectId, chapter) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        chapters: [...project.chapters, chapter]
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),

        deleteChapterFromProject: (projectId, chapter) => set((state) => {
            const updatedList = state.projectsList.map(project => {
                if (project.id.toString() === projectId.toString()) {
                    return {
                        ...project,
                        chapters: project.chapters.filter(chap =>
                            chap.id.toString() !== chapter.id.toString()
                        )
                    };
                }
                return project;
            });

            return {projectsList: updatedList};
        }),
    }))
;

export default useProjectsStore;
