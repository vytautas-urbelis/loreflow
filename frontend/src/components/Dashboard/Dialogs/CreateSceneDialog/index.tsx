import {Dialog, DialogPanel, Field, Fieldset, Input, Label, Tab, Textarea} from '@headlessui/react';
import {useState} from "react";
import {useParams} from "react-router";
import {EmptyScene, SceneInterface} from "../../../../models/scene/scene";
import {SaveNewScene, UpdateScene} from "../../../../axios/Scene.ts";
import {FiXCircle} from "react-icons/fi";
import {IoAddCircleOutline} from "react-icons/io5";
import {ProjectInterface} from "../../../../models/project";
import {ChapterInterface} from "../../../../models/chapter";
import {UseListStateHandlers} from "@mantine/hooks";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";

const CreateSceneDialog = ({
                               isCreateSceneOpen,
                               setIsCreateSceneOpen,
                               scene = EmptyScene(),
                               project,
                               // page,
                               chapter,
                               handlers,
                               scenesState
                           }: {
    isCreateSceneOpen: boolean,
    setIsCreateSceneOpen: React.Dispatch<React.SetStateAction<boolean>>,
    scene: SceneInterface,
    project: ProjectInterface,
    // page: PageInterface,
    chapter: ChapterInterface,
    handlers: UseListStateHandlers<SceneInterface>,
    scenesState: SceneInterface[],
}) => {


    // Basic Information States
    const [title, setTitle] = useState<string>(scene.title);
    const [summary, setSummary] = useState<string>(scene.summary || '');
    const [content, setContent] = useState<string>(scene.content || '');

    // Relationships States
    const [characters, setCharacters] = useState(scene.characters || []);
    const [location, setLocation] = useState(scene.location || null);
    const [items, setItems] = useState(scene.items || []);

    // Time and Weather States
    const [time, setTime] = useState(scene.time || {});
    const [weather, setWeather] = useState(scene.weather || {});

    // Goals States
    const [goals, setGoals] = useState(scene.goals || []);
    const [newGoalDescription, setNewGoalDescription] = useState('');

    // Conflict and Outcome States
    const [conflict, setConflict] = useState(scene.conflict || {});
    const [outcome, setOutcome] = useState(scene.outcome || {});

    // Misc States
    const [mood, setMood] = useState<string>(scene.mood || '');
    const [pov, setPov] = useState<string>(scene.pov || '');
    const [notes, setNotes] = useState<string>(scene.notes || '');

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();


    // Hooks for state management
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject);
    const addSceneToProject = useProjectsStore((state) => state.addSceneToChapter);

    // Selection states
    const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    // Goal management functions
    const addGoal = () => {
        if (newGoalDescription) {
            const newGoal = {
                description: newGoalDescription
            };
            setGoals([...goals, newGoal]);
            setNewGoalDescription('');
        }
    };

    const removeGoal = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    // Character management functions
    const addCharacterToScene = () => {
        if (selectedCharacter && !characters.some(char => char.id === selectedCharacter.id)) {
            setCharacters([...characters, {id: selectedCharacter.id}]);
            setSelectedCharacter(null);
        }
    };

    const getCharacterById = (id: string | number) => {
        const character = project.characters.find((char) => char.id === id);
        if (!character) {
            return undefined;
        }
        return character;
    }

    const removeCharacterFromScene = (id: number | string | null) => {
        setCharacters(characters.filter(char => char.id !== id));
    };

    // Item management functions
    const addItemToScene = () => {
        if (selectedItem && !items.some(item => item.id === selectedItem.id)) {
            setItems([...items, {id: selectedItem.id}]);
            setSelectedItem(null);
        }
    };

    const getItemById = (id: string | number) => {
        const item = project.items.find((item) => item.id === id);
        if (!item) {
            return undefined;
        }
        return item;
    }

    const removeItemFromScene = (id: number | string) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Location
    const getLocationById = (id: string) => {
        const location = project.locations.find((loc) => loc.id.toString() === id.toString());
        if (!location) {
            return undefined;
        }
        return location;
    }

    const handleUpdateScene = async (sceneData: SceneInterface): Promise<void> => {
        if (scene.id) {
            const res = await UpdateScene(accessToken, sceneData, scene.id);
            // Create a copy of page with updated scene
            // Map scenes and change current scene with updated one
            // const updatedPage = {
            //     ...page,
            //     scenes: page.scenes.map(sce => sce.id === res.data.id ? res.data : sce
            //     )
            // };

            // Create a copy of chapter with updated pages
            // First filter out the current page, then add the updated version
            const updatedChapter = {
                ...chapter,
                scenes: chapter.scenes.map(sce => sce.id === res.data.id ? res.data : sce
                )
            }

            // Update state
            updateChapterInProject(chapter.project, updatedChapter)

            // Update Draggable list
            const sceneIndex = scenesState.findIndex(scene => scene.id === res.data.id)
            handlers.remove(sceneIndex)
            handlers.insert(sceneIndex, res.data)
        }
    };

    const handleCreateScene = async (sceneData: SceneInterface): Promise<void> => {
        const response = await SaveNewScene(accessToken, sceneData)
        handleCleanForm();
        if (id) {
            addSceneToProject(project.id, chapter.id, response.data)
        }
    };

    const handleCleanForm = () => {
        setTitle('');
        setSummary('');
        setContent('');
        setCharacters([]);
        setLocation(null);
        setItems([]);
        setTime({});
        setWeather({});
        setGoals([]);
        setConflict({});
        setOutcome({});
        setMood('');
        setPov('');
        setNotes('');
    };

    // Main Save Function
    const saveScene = async () => {
        try {
            const sceneData: SceneInterface = {
                id: scene.id,
                // page: page.id,
                chapter: chapter.id,
                project: project.id,
                title,
                sequence: scene.sequence,
                summary,
                content,
                updated_content: scene.updated_content,
                characters,
                location,
                items,
                time,
                weather,
                goals,
                conflict,
                outcome,
                mood,
                pov,
                notes
            };

            // Updating scene
            if (scene.id) {
                await handleUpdateScene(sceneData);
            } else {
                await handleCreateScene(sceneData);
            }
            setIsCreateSceneOpen(false);

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Dialog
            open={isCreateSceneOpen}
            onClose={() => setIsCreateSceneOpen(false)}
            transition
            className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
        >
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition className="w-fit max-w-3xl">
                    <div className="bg-zinc-300 p-0.5 rounded-xl shadow-2xl">
                        <div className="bg-white rounded-lg shadow-inner overflow-hidden w-fit">
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                    {scene.title ? `${scene.title}` : 'Create New Scene'}
                                </h2>
                            </div>

                            {/* Main content with tabs */}
                            <div className="max-h-[75vh] overflow-y-auto">
                                <Tab.Group>
                                    <Tab.List
                                        className="flex space-x-1 border-b border-zinc-200 px-4 py-2">
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-md transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            <p className={""}>Basic Information</p>
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-md transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Characters & Settings
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Goals & Conflict
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900 '
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Details & Notes
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels
                                        className="p-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">

                                        {/* BASIC INFO SECTION */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-4">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Scene
                                                                Title</Label>
                                                            <Input
                                                                value={title}
                                                                onChange={(e) => setTitle(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Enter scene title"
                                                            />
                                                        </Field>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            {/*<Field>*/}
                                                            {/*    <Label*/}
                                                            {/*        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Chapter</Label>*/}
                                                            {/*    <Input*/}
                                                            {/*        value={chapterName}*/}
                                                            {/*        onChange={(e) => setChapterName(e.target.value)}*/}
                                                            {/*        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"*/}
                                                            {/*        placeholder="Chapter name or number"*/}
                                                            {/*    />*/}
                                                            {/*</Field>*/}

                                                            {/*<Field>*/}
                                                            {/*    <Label*/}
                                                            {/*        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Sequence</Label>*/}
                                                            {/*    <Input*/}
                                                            {/*        type="number"*/}
                                                            {/*        value={sequence || ''}*/}
                                                            {/*        onChange={(e) => setSequence(e.target.value ? Number(e.target.value) : null)}*/}
                                                            {/*        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"*/}
                                                            {/*        placeholder="Order within chapter"*/}
                                                            {/*    />*/}
                                                            {/*</Field>*/}
                                                        </div>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Summary</Label>
                                                            <Textarea
                                                                value={summary}
                                                                onChange={(e) => setSummary(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Brief summary of what happens in this scene"
                                                                rows={3}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Content</Label>
                                                            <Textarea
                                                                value={content}
                                                                onChange={(e) => setContent(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Full scene content or draft"
                                                                rows={8}
                                                            />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* CHARACTERS & SETTINGS SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Characters</Label>

                                                        <div
                                                            className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {characters.map((char) => {
                                                                const character = getCharacterById(char.id);
                                                                return (
                                                                    <div key={char.id}>
                                                                        {
                                                                            character ?
                                                                                <div

                                                                                    className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">

                                                                                    <div>
                                                                                        {character.image ? (
                                                                                            <img
                                                                                                src={character.image}
                                                                                                alt={character.name}
                                                                                                className="size-14 object-cover rounded-sm"
                                                                                            />
                                                                                        ) : (
                                                                                            <div
                                                                                                className="size-14 bg-zinc-100 rounded-md"></div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <p className="text-sm font-semibold text-zinc-700">{character.name}</p>
                                                                                        <p className="text-xs text-zinc-500">{character.role.type}</p>
                                                                                        {/*<p className="text-xs text-zinc-700">{char.description?.substring(0, 60)}...</p>*/}
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => removeCharacterFromScene(char.id)}
                                                                                        className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                    >
                                                                                        <FiXCircle/>
                                                                                    </button>
                                                                                </div> :
                                                                                <div key={char.id}

                                                                                     className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                                    <p className={"text-sm text-zinc-500"}>Character
                                                                                        was deleted</p>
                                                                                    <button
                                                                                        onClick={() => removeCharacterFromScene(char.id)}
                                                                                        className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                    >
                                                                                        <FiXCircle/>
                                                                                    </button>
                                                                                </div>
                                                                        }
                                                                    </div>


                                                                )

                                                            })}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Add
                                                                    Character</Label>
                                                                <select
                                                                    value={selectedCharacter?.id || ''}
                                                                    onChange={(e) => {
                                                                        const charId = e.target.value;
                                                                        const char = project.characters.find(c => c.id.toString() === charId) || null;
                                                                        setSelectedCharacter(char);
                                                                    }}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                >
                                                                    <option value="">Select a character</option>
                                                                    {project.characters.map(char => (
                                                                        <option key={char.id}
                                                                                value={char.id}>{char.name}</option>
                                                                    ))}
                                                                </select>
                                                            </Field>
                                                        </div>

                                                        <button
                                                            onClick={addCharacterToScene}
                                                            disabled={!selectedCharacter}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <IoAddCircleOutline className="mr-1"/>
                                                            Add Character to Scene
                                                        </button>
                                                    </Fieldset>

                                                    <div className="space-y-6">
                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Location</Label>

                                                            {location ?
                                                                <>
                                                                    {(() => {
                                                                        const loc = getLocationById(location.id)
                                                                        return (
                                                                            <>
                                                                                {loc ?

                                                                                    <div
                                                                                        className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100 mb-3">
                                                                                        <div>
                                                                                            {loc.image ? (
                                                                                                <img
                                                                                                    src={loc.image}
                                                                                                    alt={loc.name}
                                                                                                    className="size-14 object-cover rounded-sm"
                                                                                                />
                                                                                            ) : (
                                                                                                <div
                                                                                                    className="size-14 bg-zinc-100 rounded-md"></div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <p className="text-sm font-semibold text-zinc-700">{loc.name}</p>
                                                                                            <p className="text-xs text-zinc-500">{loc.type}</p>
                                                                                            <p className="text-xs text-zinc-700">{loc.description?.substring(0, 60)}...</p>
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() => setLocation(null)}
                                                                                            className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                        >
                                                                                            <FiXCircle/>
                                                                                        </button>
                                                                                    </div>
                                                                                    :
                                                                                    <div

                                                                                        className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                                        <p className={"text-sm text-zinc-500"}>Character
                                                                                            was deleted</p>
                                                                                        <button
                                                                                            onClick={() => setLocation(null)}
                                                                                            className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                        >
                                                                                            <FiXCircle/>
                                                                                        </button>
                                                                                    </div>}

                                                                            </>)
                                                                    })()}

                                                                </>
                                                                :
                                                                <div className="space-y-2">
                                                                    <Field>
                                                                        <Label
                                                                            className="block text-xs font-medium font-semibold pb-1 text-gray-700">Select
                                                                            Location</Label>
                                                                        <select
                                                                            value=""
                                                                            onChange={(e) => {
                                                                                const locId = e.target.value;
                                                                                setLocation({id: locId});
                                                                            }}
                                                                            className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        >
                                                                            <option value="">Select a location</option>
                                                                            {project.locations.map(loc => (
                                                                                <option key={loc.id}
                                                                                        value={loc.id}>{loc.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </Field>
                                                                </div>
                                                            }
                                                        </Fieldset>

                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Items</Label>

                                                            <div
                                                                className="space-y-4 max-h-[240px] overflow-y-auto pr-1 mb-3">
                                                                {items.map((it) => {
                                                                    const item = getItemById(it.id);
                                                                    return (
                                                                        <>
                                                                            {
                                                                                item ?
                                                                                    <div key={item.id}
                                                                                         className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                                        <div>
                                                                                            {item.image ? (
                                                                                                <img
                                                                                                    src={item.image}
                                                                                                    alt={item.name}
                                                                                                    className="size-12 object-cover rounded-sm"
                                                                                                />
                                                                                            ) : (
                                                                                                <div
                                                                                                    className="size-12 bg-zinc-100 rounded-md"></div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <p className="text-sm font-semibold text-zinc-700">{item.name}</p>
                                                                                            <p className="text-xs text-zinc-700">{item.description?.substring(0, 40)}...</p>
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() => removeItemFromScene(item.id)}
                                                                                            className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                        >
                                                                                            <FiXCircle/>
                                                                                        </button>
                                                                                    </div>
                                                                                    :
                                                                                    <div key={it.id}

                                                                                         className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                                        <p className={"text-sm text-zinc-500"}>Item
                                                                                            was deleted</p>
                                                                                        <button
                                                                                            onClick={() => removeItemFromScene(it.id)}
                                                                                            className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                                        >
                                                                                            <FiXCircle/>
                                                                                        </button>
                                                                                    </div>
                                                                            }
                                                                        </>
                                                                    )
                                                                })}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-xs font-medium font-semibold pb-1 text-gray-700">Add
                                                                        Item</Label>
                                                                    <select
                                                                        value={selectedItem?.id || ''}
                                                                        onChange={(e) => {
                                                                            const itemId = e.target.value;
                                                                            const item = project.items.find(i => i.id.toString() === itemId) || null;
                                                                            setSelectedItem(item);
                                                                        }}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    >
                                                                        <option value="">Select an item</option>
                                                                        {project.items.map(item => (
                                                                            <option key={item.id}
                                                                                    value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </Field>
                                                            </div>

                                                            <button
                                                                onClick={addItemToScene}
                                                                disabled={!selectedItem}
                                                                className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <IoAddCircleOutline className="mr-1"/>
                                                                Add Item to Scene
                                                            </button>
                                                        </Fieldset>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* GOALS & CONFLICT SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Scene
                                                            Goals</Label>

                                                        <div
                                                            className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {goals.map((goal, index) => (
                                                                <div key={index}
                                                                     className="flex items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-zinc-700">{goal.description}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeGoal(index)}
                                                                        className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                    >
                                                                        <FiXCircle/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Goal
                                                                    Description</Label>
                                                                <Textarea
                                                                    value={newGoalDescription}
                                                                    onChange={(e) => setNewGoalDescription(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="What needs to be accomplished"
                                                                    rows={3}
                                                                />
                                                            </Field>
                                                        </div>

                                                        <button
                                                            onClick={addGoal}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <IoAddCircleOutline className="mr-1"/>
                                                            Add Goal
                                                        </button>
                                                    </Fieldset>

                                                    <div className="space-y-6">
                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Conflict</Label>

                                                            <div className="space-y-4">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                    <Textarea
                                                                        value={conflict.description || ''}
                                                                        onChange={(e) => setConflict({
                                                                            ...conflict,
                                                                            description: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="What is the central conflict"
                                                                        rows={4}
                                                                    />
                                                                </Field>

                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Resolution</Label>
                                                                    <Textarea
                                                                        value={conflict.resolution || ''}
                                                                        onChange={(e) => setConflict({
                                                                            ...conflict,
                                                                            resolution: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="How is the conflict resolved"
                                                                        rows={4}
                                                                    />
                                                                </Field>
                                                            </div>
                                                        </Fieldset>

                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Outcome</Label>

                                                            <div className="space-y-4">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                    <Textarea
                                                                        value={outcome.description || ''}
                                                                        onChange={(e) => setOutcome({
                                                                            ...outcome,
                                                                            description: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="What is the result of this scene"
                                                                        rows={4}
                                                                    />
                                                                </Field>
                                                            </div>
                                                        </Fieldset>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* DETAILS & NOTES SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-6">
                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Time
                                                                Details</Label>

                                                            <div className="space-y-4">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Time
                                                                        of Day</Label>
                                                                    <Input
                                                                        value={time.time_of_day || ''}
                                                                        onChange={(e) => setTime({
                                                                            ...time,
                                                                            time_of_day: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Morning, Noon, Evening, Night, etc."
                                                                    />
                                                                </Field>

                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Date</Label>
                                                                    <Input
                                                                        value={time.date || ''}
                                                                        onChange={(e) => setTime({
                                                                            ...time,
                                                                            date: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Story date or calendar date"
                                                                    />
                                                                </Field>
                                                            </div>
                                                        </Fieldset>

                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Weather</Label>

                                                            <div className="space-y-4">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Condition</Label>
                                                                    <Input
                                                                        value={weather.condition || ''}
                                                                        onChange={(e) => setWeather({
                                                                            ...weather,
                                                                            condition: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Clear, Stormy, Rainy, etc."
                                                                    />
                                                                </Field>

                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                    <Textarea
                                                                        value={weather.description || ''}
                                                                        onChange={(e) => setWeather({
                                                                            ...weather,
                                                                            description: e.target.value
                                                                        })}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Detailed weather description"
                                                                        rows={3}
                                                                    />
                                                                </Field>
                                                            </div>
                                                        </Fieldset>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Scene
                                                                Atmosphere</Label>

                                                            <div className="space-y-4">
                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Mood</Label>
                                                                    <Input
                                                                        value={mood}
                                                                        onChange={(e) => setMood(e.target.value)}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Tense, Joyful, Mysterious, etc."
                                                                    />
                                                                </Field>

                                                                <Field>
                                                                    <Label
                                                                        className="block text-sm font-medium font-semibold pb-1 text-gray-700">Point
                                                                        of View</Label>
                                                                    <Input
                                                                        value={pov}
                                                                        onChange={(e) => setPov(e.target.value)}
                                                                        className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="First person, Third limited, etc."
                                                                    />
                                                                </Field>
                                                            </div>
                                                        </Fieldset>

                                                        <Fieldset className="">
                                                            <Label
                                                                className="block text-lg font-medium font-semibold pb-2 text-gray-700">Notes</Label>
                                                            <Field>
                                                                <Textarea
                                                                    value={notes}
                                                                    onChange={(e) => setNotes(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Additional notes, ideas, or reminders"
                                                                    rows={6}
                                                                />
                                                            </Field>
                                                        </Fieldset>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>

                            {/* Fixed action buttons */}
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100 flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsCreateSceneOpen(false)}
                                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveScene}
                                    className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all transform hover:scale-[1.02]"
                                >
                                    Save Scene
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default CreateSceneDialog;
