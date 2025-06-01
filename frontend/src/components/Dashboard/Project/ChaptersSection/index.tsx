import {ChapterInterface} from "../../../../models/chapter";
import ChapterCollapseWrapper from "../../../../wrappers/ChapterCollapseWrapper.tsx";
import {ProjectInterface} from "../../../../models/project";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {useListState} from "@mantine/hooks";
import {useEffect, useState} from "react";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";
import SceneView from "./Scene";
import {EmptyScene, SceneInterface} from "../../../../models/scene/scene.tsx";
import {ReorderSceneListInPage, SaveNewScene} from "../../../../axios/Scene.ts";


const ChapterSection = ({chapter, project}: {
    chapter: ChapterInterface,
    project: ProjectInterface,
}) => {

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)

    // States
    const [isDragging, setDragging] = useState(false);
    const [addScene, setAddScene] = useState(false);
    const [scenesSequence, setScenesSequence] = useState<object[]>([]);

    // listState
    const [currentChapterLength, setCurrentChapterLength] = useState<number | undefined>(chapter?.scenes.length);
    const [scenesState, handlers] = useListState(chapter?.scenes)

    // Variables
    const chapterScenes = chapter ? chapter.scenes : 0;

    // References


    // Functions

    // Functions
    // Add new scene in local store and database
    const addNewScene = async () => {
        try {
            let lastSceneSequence = 0

            if (chapter.scenes.length >= 1) {
                lastSceneSequence = chapter.scenes.reduce((max, obj) =>
                    obj.sequence > max.sequence ? obj : max
                ).sequence;
            }

            // Create empty scene
            const emptyScene = {
                ...EmptyScene(),
                title: 'New scene',
                chapter: chapter.id,
                project: project.id,
                sequence: lastSceneSequence + 1
            };

            // Saving scene to database
            const res = await SaveNewScene(accessToken, emptyScene)

            // // Update local state
            handlers.append(res.data); // Update the useListState

            const updatedChapter = {
                ...chapter,
                scenes: [...chapter.scenes, res.data]
            };

            // Update local state
            updateChapterInProject(chapter.project, updatedChapter)
        } catch (e) {
            console.error(e);
        }
    }

    // Function to create sequence list for pages later used for comparing and updating in database
    const createSequenceList = (scenes: SceneInterface[]) => {
        const sequence = []

        for (let i = 0; i < scenes.length; i++) {
            sequence.push({id: scenes[i].id, sequence: i + 1});
        }
        return sequence;
    }

    // UseEffects

    // Update draggable pages list if something in this chapter changed
    useEffect(() => {
        if (chapter?.pages) {
            handlers.setState(chapter?.scenes)
        }
    }, [chapter?.scenes]);

    // Create and save scenes sequence list
    useEffect(() => {
        if (chapter) {
            setScenesSequence(createSequenceList(chapter.scenes));
        }
    }, [chapterScenes]);


    // UseEffect to listen for new page added and scroll down
    useEffect(() => {
        if (currentChapterLength && scenesState.length > currentChapterLength) {
            window.scrollBy({top: window.innerHeight * 0.4, behavior: 'smooth'});

        }
        setCurrentChapterLength(scenesState.length);
    }, [scenesState]);


    // Check if order of list changed, if so, update database
    useEffect(() => {
        // Skip updates during drag operations
        if (isDragging) return

        // Reorder scenes in database
        const reorderScenesListInPage = async () => {
            try {
                await ReorderSceneListInPage(accessToken, {order: sequence})
                updateLocalState()
                // Updating local state with new list order
                setScenesSequence(sequence);
            } catch (e) {
                console.log(e)
            }
        }

        // Update local state
        const updateLocalState = () => {
            // Create chapter copy and update with new page list
            const updateChapter = {
                ...chapter, scenes: scenesState
            }

            // Update local state
            updateChapterInProject(project.id, updateChapter)
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
        if (!scenesState.length || !scenesSequence.length) return;

        // Create sequence of Draggable list
        const sequence = createSequenceList(scenesState);

        // Check if order changes and call Reorder function if yes
        if (checkIfSequencesChanged(sequence, scenesSequence)) {
            reorderScenesListInPage();
        }
    }, [scenesState]);

    return (<>
            {project && chapter &&
                <ChapterCollapseWrapper label={`Chapter ${chapter.name}`} chapter={chapter} project={project}>
                    <DragDropContext
                        onDragEnd={({destination, source}) => {
                            setDragging(false);
                            if (!destination) return;
                            handlers.reorder({from: source.index, to: destination.index});
                        }}
                        onDragStart={() => setDragging(true)}
                    >
                        <Droppable droppableId="dnd-list" direction="vertical">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`droppable-container w-full flex flex-col gap-4 items-center`}
                                >
                                    {scenesState.map((scene, index) => (
                                        // <Draggable key={page.id} index={index} draggableId={page.id.toString()}>
                                        //     {(provided) => (
                                        //         <div
                                        //             ref={provided.innerRef}
                                        //             {...provided.draggableProps}
                                        //         >
                                        //             <PageSection
                                        //                 key={page.id}
                                        //                 chapter={chapter}
                                        //                 page={page}
                                        //                 index={index}
                                        //                 handlers={handlers}
                                        //                 pagesState={pagesState}
                                        //                 isDragging={isDragging}
                                        //                 setDragging={setDragging}
                                        //                 draggableProps={{...provided.dragHandleProps}}
                                        //             />
                                        //         </div>
                                        //     )}
                                        // </Draggable>
                                        <Draggable key={scene.id} index={index} draggableId={scene.id.toString()}>
                                            {(provided) => (
                                                <div
                                                    className={"mb-8 w-full flex justify-center flex-col items-center"}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    key={scene.id}
                                                >
                                                    <div className={"w-full flex max-w-260 "}>
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
                                                    {/*<div className={"max-w-260 flex w-full"}>*/}
                                                    {/*    <div className={"w-full mt-4"}>*/}
                                                    {/*        {!addScene ? <div onClick={() => {*/}
                                                    {/*                setAddScene(true)*/}
                                                    {/*            }}*/}
                                                    {/*                          className={"bg-white text-xs px-2 py-1 mb-4 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>*/}
                                                    {/*                Add scene*/}
                                                    {/*            </div> :*/}
                                                    {/*            <div className={"flex gap-1"}>*/}
                                                    {/*                <div onClick={() => {*/}
                                                    {/*                    setAddScene(false)*/}
                                                    {/*                    addNewScene()*/}
                                                    {/*                }}*/}
                                                    {/*                     className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>*/}
                                                    {/*                    New*/}
                                                    {/*                </div>*/}
                                                    {/*                <div onClick={() => {*/}
                                                    {/*                    setAddScene(true)*/}
                                                    {/*                }}*/}
                                                    {/*                     className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>*/}
                                                    {/*                    Existing*/}
                                                    {/*                </div>*/}
                                                    {/*                <div onClick={() => {*/}
                                                    {/*                    setAddScene(false)*/}
                                                    {/*                }}*/}
                                                    {/*                     className={"bg-white text-xs px-2 py-1 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>*/}
                                                    {/*                    x*/}
                                                    {/*                </div>*/}
                                                    {/*            </div>}*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {/*<Droppable droppableId="dnd-list" direction="vertical">*/}
                        {/*    {(provided) => (*/}
                        {/*        <div*/}
                        {/*            {...provided.droppableProps}*/}
                        {/*            ref={provided.innerRef}*/}
                        {/*            className={`droppable-container w-full flex flex-col gap-4`}*/}
                        {/*        >*/}
                        {/*            {pagesState.map((page, index) => (*/}
                        {/*                <Draggable key={page.id} index={index} draggableId={page.id.toString()}>*/}
                        {/*                    {(provided) => (*/}
                        {/*                        <div*/}
                        {/*                            ref={provided.innerRef}*/}
                        {/*                            {...provided.draggableProps}*/}
                        {/*                        >*/}
                        {/*                            <PageSection*/}
                        {/*                                key={page.id}*/}
                        {/*                                chapter={chapter}*/}
                        {/*                                page={page}*/}
                        {/*                                index={index}*/}
                        {/*                                handlers={handlers}*/}
                        {/*                                pagesState={pagesState}*/}
                        {/*                                isDragging={isDragging}*/}
                        {/*                                setDragging={setDragging}*/}
                        {/*                                draggableProps={{...provided.dragHandleProps}}*/}
                        {/*                            />*/}
                        {/*                        </div>*/}
                        {/*                    )}*/}
                        {/*                </Draggable>*/}
                        {/*            ))}*/}
                        {/*            {provided.placeholder}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</Droppable>*/}
                    </DragDropContext>
                    <div
                        className={"mb-8 w-full flex justify-center flex-col items-center"}>
                        <div className={"max-w-260 flex w-full"}>
                            <div className={"w-full mt-4"}>
                                {!addScene ? <div onClick={() => {
                                        setAddScene(true)
                                    }}
                                                  className={"bg-white text-xs px-2 py-1 mb-4 border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
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
                        </div>
                    </div>


                </ChapterCollapseWrapper>}

        </>
    )
}

export default ChapterSection