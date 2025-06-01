import {ChapterInterface, PageInterface} from "../../../../../../models/chapter";
import {useEffect, useState} from "react";
import {EmptyScene, SceneInterface} from "../../../../../../models/scene/scene.tsx";

import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import SceneView from "../../Scene";
import {useListState} from "@mantine/hooks";
import {ReorderSceneListInPage, SaveNewScene} from "../../../../../../axios/Scene.ts";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";

const PageScenesSection = ({chapter, page}: {
    chapter: ChapterInterface,
    page: PageInterface,
}) => {
    // States
    const [addScene, setAddScene] = useState<boolean>(false);
    const [sceneSequence, setSceneSequence] = useState<object[]>([]);

    // List state
    const [scenesState, handlers] = useListState(page.scenes);

    // Content references

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)

    // UseEffects

    // Update draggable pages list if something in this chapter changed
    useEffect(() => {
        if (page.scenes) {
            console.log("pageScenes", page.scenes);
            handlers.setState(page.scenes)
        }
    }, [page.scenes]);

    // Create and save scenes sequence list
    useEffect(() => {
        setSceneSequence(createSequenceList(page.scenes));
    }, []);

    const createSequenceList = (scenes: SceneInterface[]) => {
        const sequence = []
        for (let i = 0; i < scenes.length; i++) {
            sequence.push({id: scenes[i].id, sequence: i + 1});
        }
        return sequence;
    }


    // Check if order of list changed
    useEffect(() => {
        // Reorder scenes in database
        const reorderScenesListInPage = async () => {
            try {
                await ReorderSceneListInPage(accessToken, {order: sequence})
                updateLocalState()
                // Updating local state with new list order
                setSceneSequence(sequence);
            } catch (e) {
                console.log(e)
            }
        }

        // Update local state
        const updateLocalState = () => {
            const updatedPage = {
                ...page,
                scenes: scenesState
            }

            // Create chapter copy and update with new page list
            const updateChapter = {
                ...chapter, pages: chapter.pages.map((page) => page.id === updatedPage.id ? updatedPage : page),
            }

            // Update local state
            updateChapterInProject(chapter.project, updateChapter)
        }

        // Proper deep comparison of sequence objects
        const checkIfSequencesChanged = (newSequence: any, oldSequence: any) => {
            if (newSequence.length !== oldSequence.length) return true;

            for (let i = 0; i < newSequence.length; i++) {
                // Compare by values, not references
                if (newSequence[i].id !== oldSequence[i].id ||
                    newSequence[i].sequence !== oldSequence[i].sequence) {
                    return true;
                }
            }
            return false;
        }

        // Only proceed if we have valid sequences
        if (!scenesState.length || !sceneSequence.length) return;

        // Create sequence of Draggable list
        const sequence = createSequenceList(scenesState);

        // Check if order changes and call Reorder function if yes
        if (checkIfSequencesChanged(sequence, sceneSequence)) {
            reorderScenesListInPage();
        }
    }, [scenesState]);


    // Functions
    // Add new scene in local store and database
    const addNewScene = async () => {
        try {
            console.log(page)
            // Create empty scene with title

            let lastSceneSequence = 0

            if (page.scenes.length >= 1) {
                lastSceneSequence = page.scenes.reduce((max, obj) =>
                    obj.sequence > max.sequence ? obj : max
                ).sequence;
            }

            // Create empty scene
            const emptyScene = {...EmptyScene(), title: 'New scene', page: page.id, sequence: lastSceneSequence + 1};

            // Saving scene to database
            const res = await SaveNewScene(accessToken, emptyScene)


            // Create a copy of the page with the new scene added
            const updatedPage = {
                ...page,
                scenes: [...page.scenes, res.data]
            };

            // // Update local state
            handlers.append(res.data); // Update the useListState

            // Create a copy of chapter with updated pages
            // First filter out the current page, then add the updated version
            const updatedChapter = {
                ...chapter,
                pages: chapter.pages.map(p =>
                    p.id.toString() === page.id.toString() ? updatedPage : p
                )
            };

            // Update local state
            updateChapterInProject(chapter.project, updatedChapter)
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div className={"2xl:col-span-9 "}>
            <DragDropContext
                onDragEnd={({destination, source}) => {
                    if (!destination) return;
                    handlers.reorder({from: source.index, to: destination.index});
                }}
            >
                <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {scenesState.map((scene, index) => (
                                <Draggable key={scene.id} index={index} draggableId={scene.id.toString()}>
                                    {(provided) => (
                                        <div
                                            className={"mb-8"}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div
                                                key={scene.id}>
                                                <SceneView
                                                    scene={scene}
                                                    index={index}
                                                    // page={page}
                                                    chapter={chapter}
                                                    handlers={handlers}
                                                    scenesState={scenesState}
                                                    draggableProps={{...provided.dragHandleProps}}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {!addScene ? <div onClick={() => {
                    setAddScene(true)
                }}
                              className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                    Add scene
                </div> :
                <div className={"flex gap-1"}>
                    <div onClick={() => {
                        setAddScene(false)
                        addNewScene()
                    }}
                         className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                        New
                    </div>
                    <div onClick={() => {
                        setAddScene(true)
                    }}
                         className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                        Existing
                    </div>
                    <div onClick={() => {
                        setAddScene(false)
                    }}
                         className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                        x
                    </div>
                </div>}

        </div>


    )
}

export default PageScenesSection