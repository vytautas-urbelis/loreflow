import {useEditor} from '@tiptap/react';
import {Color} from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import {RichTextEditor} from '@mantine/tiptap';
import {SceneInterface} from "../../../../../models/scene/scene.tsx";
import {LuSword} from "react-icons/lu";
import {CgGhostCharacter} from "react-icons/cg";
import {IoLocationOutline} from "react-icons/io5";
import {MdOutlineEdit} from "react-icons/md";
import CreateSceneDialog from "../../../Dialogs/CreateSceneDialog";
import {useEffect, useMemo, useRef, useState} from "react";
import {useParams} from "react-router";
import SceneCharacters from "./SceneCharacters";
import SceneItems from "./SceneItems";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {ChapterInterface} from "../../../../../models/chapter";
import {UseListStateHandlers} from "@mantine/hooks";
import {DeleteScene, UpdateScene} from "../../../../../axios/Scene.ts";
import {RxDragHandleDots1} from "react-icons/rx";
import useProjectsStore from "../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../zustand/AuthStore.tsx";
import useContextStore from "../../../../../zustand/Context.tsx";
import TextSelectorWrapper from "../../../../../wrappers/TextSelectorWrapper.tsx";
import CreateLocationDialog from "../../../Dialogs/CreateLocationDialog";
import UpdatedContent from "./UpdatedContent";

function SceneView({
                       scene,
                       index = null,
                       chapter,
                       handlers,
                       scenesState,
                       draggableProps
                   }: {
    scene: SceneInterface
    index: number | null,
    // page: PageInterface,
    chapter: ChapterInterface,
    handlers: UseListStateHandlers<SceneInterface>,
    scenesState: SceneInterface[],
    draggableProps: any,
}) {

    // states management
    const [content, setContent] = useState<string>(scene.content);
    const [updatedContent, setUpdatedContent] = useState<string>(scene.updated_content);
    const [selectedText, setSelectedText] = useState<string | undefined>('');
    const [isCreateSceneOpen, setIsCreateSceneOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false);


    // Content references
    const contentRef = useRef(content);
    const updatedContentRef = useRef(updatedContent);

    // Tracks zustand state reference for useEffect to have updated state on destroy
    const sceneContentRef = useRef(scene.content);
    const sceneUpdatedContentRef = useRef(scene.updated_content);

    // Hooks
    const {id} = useParams();
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const project = useProjectsStore((state) => state.projectsList.find(item => item.id === id?.toString()))

    // Hooks to update localStorage
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)
    const setContext = useContextStore((state) => state.setContext);
    const setSelectedContextText = useContextStore((state) => state.setSelectedText)

    // Text editor definition
    const editor = useEditor({
        extensions: [StarterKit, TextStyle, Color],
        content: contentRef.current,
        onUpdate: ({editor}) => {
            setContent(editor.getHTML());
        }
    });

    // useEffects
    // Update refs when state changes
    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    useEffect(() => {
        sceneContentRef.current = scene.content;
        sceneUpdatedContentRef.current = scene.updated_content;
        setContent(scene.content);
    }, [scene?.id, scene?.content, editor]);

    useEffect(() => {
        updatedContentRef.current = updatedContent;
    }, [updatedContent]);

    // Save content on component destroy
    useEffect(() => {
        return () => {
            if (contentRef.current !== sceneContentRef.current || updatedContentRef.current !== sceneUpdatedContentRef.current) {
                updateScene(contentRef.current, updatedContentRef.current)
            }
        };
    }, []);

    useEffect(() => {
        if (editor && scene?.content !== editor.getHTML()) {
            editor.commands.setContent(scene.content || '');
        }
    }, [scene?.id, scene?.content, editor]);

    // Updating database with debouncing
    useEffect(() => {

        const debounceTimeout = setTimeout(() => {
            if (content !== scene.content || updatedContent !== scene.updated_content) {
                updateScene(contentRef.current, updatedContent);
            }
        }, 500); // 1 second debounce delay

        // Cleanup function to clear the timeout if scene changes again before timeout completes
        return () => {
            clearTimeout(debounceTimeout)
            // updateScene()
        };
    }, [content, updatedContent]);

    // Functions
    const updateScene = async (content: string, updatedContent: string) => {
        try {
            // Create updated scene object
            const updatedScene = {...scene, content: content, updated_content: updatedContent};
            const res = await UpdateScene(accessToken, updatedScene, scene.id);

            // Create a copy of chapter with updated pages
            // First filter out the current page, then add the updated version
            const updatedChapter = {
                ...chapter,
                scenes: chapter.scenes.map(s => s.id === res.data.id ? res.data : s
                )
            }

            // Update Draggable list
            const sceneIndex = scenesState.findIndex(scene => scene.id === res.data.id)
            handlers.remove(sceneIndex)
            handlers.insert(sceneIndex, res.data)

            // Need to update Pages draggable list too because scenes list is in Pages list

            // Update state
            updateChapterInProject(chapter.project, updatedChapter)
        } catch (e) {
            console.log(e)
        }
    }

    // --- Memoized lookups for expensive calculations ---
    const sceneCharacters = useMemo(() => {
        if (!project || !scene.characters) return [];
        return scene.characters
            .map(c => project.characters.find(char => char.id === c.id))
            .filter(Boolean);
    }, [scene.characters, project]);

    const sceneItems = useMemo(() => {
        if (!project || !scene.items) return [];
        return scene.items
            .map(i => project.items.find(item => item.id === i.id))
            .filter(Boolean);
    }, [scene.items, project]);

    const sceneLocation = useMemo(() => {
        if (!project || !scene.location) return null;
        return project.locations.find(loc => loc.id === scene.location?.id) || null;
    }, [scene.location, project]);


    const deleteScene = async (scene: SceneInterface) => {
        try {
            // If scene id deleted from page, then delete it from page to
            if (chapter && scenesState && handlers) {

                // Delete scene from Draggable list
                const sceneIndex = scenesState.findIndex(s => s.id.toString() === scene.id.toString());
                if (sceneIndex !== -1) {
                    handlers.remove(sceneIndex);
                }

                const updatedChapter = {
                    ...chapter,
                    scenes: chapter.scenes.filter(sce => sce.id !== scene.id
                    )
                }

                // Update in database
                await DeleteScene(accessToken, scene.id);

                // Update in local storage
                updateChapterInProject(chapter.project, updatedChapter)
            }

        } catch (e) {
            console.log(e)
        }
    }

    const handleContextSet = () => {
        const updatedChapter = {...chapter, scenes: [scene], pages: []};
        setContext(updatedChapter)
        setSelectedContextText(selectedText);
    }

    return (
        <div className={"w-full "}>
            <RichTextEditor key={scene.id} onClick={() => handleContextSet()} editor={editor}
                            className={"p-3 bg-white"}>
                <div className={"flex justify-between bg-white rounded-md py-2"}>
                    <div>
                        <div className={"flex"}  {...draggableProps}>
                            <RxDragHandleDots1/>
                            {index !== null &&
                                <p className={"text-xs font-semibold text-zinc-500 uppercase"}>Scene {index + 1}
                                    {/*-<span className={"text-xs font-normal text-zinc-400 uppercase"}>Page {page.sequence}</span>*/}
                                </p>}

                        </div>
                        <p className={"text-xs font-semibold text-zinc-800 uppercase mt-3"}>Scene: {scene.title}</p>
                    </div>
                    <div>
                        {isDeleting ?
                            <div className={"flex justify-end w-full gap-1"}>
                                <div onClick={() => {
                                    setIsDeleting(false)
                                }}
                                     className={"text-zinc-400 duration-300 hover:text-zinc-800 text-sm"}>
                                    <FiXCircle/>
                                </div>
                                <div onClick={() => {
                                    deleteScene(scene)
                                }}
                                     className={"text-zinc-400 duration-300 hover:text-zinc-800 text-sm"}>
                                    <FiCheckCircle/></div>
                            </div> :
                            <div className={"flex justify-end w-full"}>
                                <div onClick={() => {
                                    setIsDeleting(true)
                                }}
                                     className={"text-zinc-400 duration-300 hover:text-zinc-800 text-sm"}>
                                    <RiDeleteBin6Line/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <TextSelectorWrapper setSelectedText={setSelectedText}>
                    <RichTextEditor.Content
                        className={"border border-dashed border-zinc-300 rounded-md text-base"}>
                        <div className={"flex p-3 gap-1"}>
                            <RichTextEditor.ControlsGroup className="z-0">
                                <RichTextEditor.Color color="#F03E3E"/>
                                <RichTextEditor.Color color="#7048E8"/>
                                <RichTextEditor.Color color="#1098AD"/>
                                <RichTextEditor.Color color="#37B24D"/>
                                <RichTextEditor.Color color="#F59F00"/>
                                <RichTextEditor.Color color="#000000"/>
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold/>
                                <RichTextEditor.Italic/>
                                <RichTextEditor.Strikethrough/>
                                <RichTextEditor.ClearFormatting/>
                            </RichTextEditor.ControlsGroup></div>
                    </RichTextEditor.Content>
                </TextSelectorWrapper>
                {project &&
                    <UpdatedContent scene={scene} setUpdatedContent={setUpdatedContent} updatedContent={updatedContent}
                                    updatedContentRef={updatedContentRef} project={project} chapter={chapter}/>}


                <div className={""}>
                    <div className={"flex mt-2"}>
                        <div className={"flex gap-2 w-full mt-2 items-start justify-start"}>
                            <div className={"flex flex-row"}
                                // className={"size-7 bg-zinc-50 rounded-lg flex flex-col justify-center items-center border-zinc-300 border border-2 opacity-100 hover:opacity-100 hover:border-zinc-700"}
                            >

                                <div className={"opacity-70 hover:opacity-100 text-md"}><CgGhostCharacter/></div>
                                <div style={{width: `${scene.characters.length * 11 + 10}px`}} className={"relative"}>

                                    {sceneCharacters.map((character, index) => {
                                            return (
                                                <div key={character?.id}>
                                                    {character && project &&
                                                        <SceneCharacters key={character.id} character={character}
                                                                         index={index} project={project}/>}
                                                </div>
                                            )
                                        }
                                    )}

                                </div>
                                <p className={"text-xs text-zinc-500"}>{scene.characters.length}</p>


                            </div>
                            <div className={"flex flex-row"}
                                // className={"size-7 bg-zinc-50 rounded-lg flex flex-col justify-center items-center border-zinc-300 border border-2 opacity-100 hover:opacity-100 hover:border-zinc-700"}
                            >
                                <span className={"opacity-70 hover:opacity-100 text-md"}><LuSword/></span>
                                <div style={{width: `${scene.items.length * 11 + 10}px`}} className={"relative"}>
                                    {sceneItems.map((item, index) => {
                                            return (
                                                <div key={item?.id}>
                                                    {item && project && <SceneItems key={item.id} item={item} index={index}
                                                                                    project={project}/>}
                                                </div>

                                            )
                                        }
                                    )}
                                </div>
                                <p className={"text-xs text-zinc-500"}>{scene.items.length}</p>
                            </div>
                            <div className={"flex flex-row "}
                                // className={"size-7 bg-zinc-50 rounded-lg flex flex-col justify-center items-center border-zinc-300 border border-2 opacity-100 hover:opacity-100 hover:border-zinc-700"}
                            >
                                <span className={"opacity-70 hover:opacity-100 text-md"}><IoLocationOutline/></span>

                                <div className={"relative"}>
                                    {sceneLocation && (() => {
                                        return (<div
                                            className={`text-xs text-zinc-500 ml-1`}>
                                            {sceneLocation && project &&
                                                <CreateLocationDialog isCreateLocationOpen={isCreateLocationOpen}
                                                                      setIsCreateLocationOpen={setIsCreateLocationOpen}
                                                                      location={sceneLocation}
                                                                      project={project}/>}

                                            <p className={"hover:underline cursor-pointer"}
                                               onClick={() => setIsCreateLocationOpen(true)}>{sceneLocation?.name}, {sceneLocation?.type}</p>
                                        </div>)

                                    })()}

                                </div>
                            </div>
                        </div>
                        {isCreateSceneOpen && project && <CreateSceneDialog isCreateSceneOpen={isCreateSceneOpen}
                                                                            setIsCreateSceneOpen={setIsCreateSceneOpen}
                                                                            project={project}
                                                                            scene={scene}
                                                                            chapter={chapter}
                                                                            handlers={handlers}
                                                                            scenesState={scenesState}
                        />}

                        <div onClick={() => setIsCreateSceneOpen(true)}
                             className={"size-5 bg-zinc-50 rounded-lg flex flex-col justify-center items-center opacity-50 hover:opacity-100  mt-2"}>
                            <span className={"opacity-70 hover:opacity-100 text-lg"}><MdOutlineEdit/></span>
                        </div>
                    </div>
                    {index !== null && <div className={"w-full justify-end flex"}><p
                        className={"text-xs text-zinc-500 mt-1"}>Seq: {index + 1}</p></div>}
                </div>
            </RichTextEditor>
        </div>
    );
}

export default SceneView;