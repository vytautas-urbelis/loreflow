import {Dialog, DialogPanel, Field, Fieldset, Input, Label, Tab, Textarea} from '@headlessui/react';
import {useState} from "react";
import {useParams} from "react-router";
import {
    AppearanceInterface,
    BackstoryInterface,
    CharacterInterface,
    DemographicsInterface,
    EmptyCharacter,
    PersonalityInterface,
    RelationshipsInterface,
    RoleInterface
} from "../../../../models/character/character.ts";
import {DeleteCharacterImage, SaveNewCharacter, UpdateCharacter} from "../../../../axios/Character.ts";
import {FiXCircle} from "react-icons/fi";
import {IoAddCircleOutline} from "react-icons/io5";
import {ProjectInterface} from "../../../../models/project";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";


const CreateCharacterDialog = ({
                                   isCreateCharacterOpen,
                                   setIsCreateCharacterOpen,
                                   character = EmptyCharacter(),
                                   project
                               }: {
    isCreateCharacterOpen: boolean,
    setIsCreateCharacterOpen: React.Dispatch<React.SetStateAction<boolean>>,
    character: CharacterInterface,
    project: ProjectInterface,
}) => {

    // States
    const [name, setName] = useState<string>(character.name);
    const [imageToSend, setImageTooSend] = useState<File | null | string>(character.image ? character.image : null);
    const [imageToShow, setImageToShow] = useState<string | null>(character.image);
    const [symbolism, setSymbolism] = useState<string>(character.symbolism);
    const [character_arc, setCharacterArc] = useState<string>(character.character_arc);
    const [aliases, setAliases] = useState<string[]>(character.aliases || []);
    const [newAlias, setNewAlias] = useState<string>('');
    const [role, setRole] = useState<RoleInterface>(character.role);
    const [demographics, setDemographics] = useState<DemographicsInterface>(character.demographics);
    const [appearance, setAppearance] = useState<AppearanceInterface>(character.appearance);
    const [personality, setPersonality] = useState<PersonalityInterface>(character.personality);
    const [newTrait, setNewTrait] = useState<string>('');
    const [newMotivation, setNewMotivation] = useState<string>('');
    const [newFlaw, setNewFlaw] = useState<string>('');
    const [backstory, setBackstory] = useState<BackstoryInterface>(character.backstory);
    const [newEvent, setNewEvent] = useState<string>('');
    const [relationships, setRelationships] = useState<RelationshipsInterface[]>(character.relationships || []);
    const [relationshipName, setRelationshipName] = useState<string>("");
    const [relRelation, setRelRelation] = useState<string>("");
    const [relDynamic, setRelDynamic] = useState<string>("");

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateCharacterInProject = useProjectsStore((state) => state.updateCharacterInProject);
    const addCharacterToProject = useProjectsStore((state) => state.addCharacterToProject);

    // Variables
    const {id} = useParams();


    const getRelatedCharacter = (characterName: string) => {
        const character = project.characters.find(item => item.name.toLowerCase() === characterName.toLowerCase());
        if (character) {
            if (character.image) {
                return character.image;
            } else {
                return undefined
            }
        } else {
            return undefined;
        }
    }

    const addItemToArray = (
        setter: (array: string[]) => void,
        array: string[],
        defaultValue: string,
        cleaner: (array: string) => void,) => {
        setter([...array, defaultValue]);
        cleaner('')
    };

    const removeArrayItem = <T, >(
        setter: (array: T[]) => void,
        array: T[],
        index: number,) => {
        setter(array.filter((_, i) => i !== index));
    };

    const addRelationship = () => {
        setRelationships([...relationships, {name: relationshipName, relation: relRelation, dynamic: relDynamic}]);
        setRelationshipName("")
        setRelRelation("")
        setRelDynamic("")
    };

    const removeRelationship = (index: number) => {
        setRelationships(relationships.filter((_, i) => i !== index));
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImageTooSend(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageToShow(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleUpdateCharacter = async (formData: FormData, character: CharacterInterface): Promise<void> => {
        if (character.id) {
            if (imageToSend === null) {
                await DeleteCharacterImage(accessToken, character.id)
            }
            const response = await UpdateCharacter(accessToken, formData, character.id);
            if (id) {
                updateCharacterInProject(id, response.data)
            }
        }
    }

    const handleCreateCharacter = async (formData: FormData): Promise<void> => {
        const response = await SaveNewCharacter(accessToken, formData);
        handleCleanForm()
        if (id) {
            addCharacterToProject(id, response.data)
        }
    }

    const handleCleanForm = () => {
        setName("")
        setImageTooSend(null)
        setImageToShow(null)
        setSymbolism("")
        setCharacterArc("")
        setAliases([""])
        setRole(character.role)
        setDemographics(character.demographics)
        setAppearance(character.appearance)
        setPersonality(character.personality)
        setBackstory(character.backstory)
        setRelationships([])
    }

    // Functions
    const saveCharacter = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("symbolism", symbolism);
            formData.append("character_arc", character_arc);
            formData.append("aliases", JSON.stringify(aliases));
            formData.append("role", JSON.stringify(role));
            formData.append("demographics", JSON.stringify(demographics));
            formData.append("appearance", JSON.stringify(appearance));
            formData.append("personality", JSON.stringify(personality));
            formData.append("backstory", JSON.stringify(backstory));
            formData.append("relationships", JSON.stringify(relationships));

            formData.append("project", id ? id : '');
            // formData.append("additionalInformation", JSON.stringify(additionalInformation));
            if (imageToSend !== null && (typeof imageToSend) !== "string") {
                formData.append("image", imageToSend);
            }

            // Updating character
            if (character.id) {
                handleUpdateCharacter(formData, character)

            } else {
                handleCreateCharacter(formData)
            }
            setIsCreateCharacterOpen(false);

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Dialog
            open={isCreateCharacterOpen}
            onClose={() => setIsCreateCharacterOpen(false)}
            transition
            className="z-50 fixed inset-0 flex w-screen items-center justify-center bg-black/30 transition duration-300 ease-out data-[closed]:opacity-0"
        >
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition className="w-fit max-w-3xl">
                    <div className="shadow-2xl">
                        <div className="bg-white rounded-sm border border-zinc-300 shadow-inner overflow-hidden w-fit">
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                    {character.name ? `${character.name}` : 'Create New Character'}
                                </h2>
                            </div>

                            {/* Main content with tabs */}
                            <div className="max-h-[75vh] overflow-y-auto ">
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
                                            Role & Demographics
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Appearance & Personality
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900 '
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Backstory & Relationships
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels
                                        className="p-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">
                                        {/* BASIC INFO SECTION */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                {/*<h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">*/}
                                                {/*    <p className="text-2xl font-semibold text-indigo-700 flex items-center">*/}
                                                {/*        <CgGhostCharacter/></p>*/}
                                                {/*    Basic Information*/}
                                                {/*</h3>*/}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div
                                                        className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Character
                                                                Name</Label>
                                                            <Input
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Enter character name"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Character
                                                                Arc</Label>
                                                            <Textarea
                                                                value={character_arc}
                                                                onChange={(e) => setCharacterArc(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Describe character's arc"
                                                                rows={3}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Symbolism</Label>
                                                            <Textarea
                                                                value={symbolism}
                                                                onChange={(e) => setSymbolism(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What does this character symbolize?"
                                                                rows={3}
                                                            />
                                                        </Field>
                                                    </div>
                                                    <div
                                                        className="space-y-4">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Character
                                                                Image</Label>
                                                            <div className="flex items-center">
                                                                {imageToShow ? (
                                                                    <div
                                                                        className="relative w-32 h-32 overflow-hidden rounded-md border-2 border-indigo-200 shadow-sm">
                                                                        <img src={imageToShow} alt={name}
                                                                             className="object-cover w-full h-full"/>
                                                                        <button
                                                                            onClick={() => {
                                                                                setImageToShow(null)
                                                                                setImageTooSend(null)
                                                                            }}
                                                                            className="absolute top-1 right-1 text-red-500 bg-white rounded-full hover:text-red-600 transition"
                                                                        >
                                                                            <FiXCircle/>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="w-32 h-32 bg-indigo-50 rounded-md flex items-center justify-center border-2 border-dashed border-indigo-200">
                                                                        <label
                                                                            className="cursor-pointer text-center p-2">
                                                                            <span
                                                                                className="block text-sm text-indigo-600">Upload Image</span>
                                                                            <input
                                                                                type="file"
                                                                                className="hidden"
                                                                                onChange={handleImageUpload}
                                                                                accept="image/*"
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Field>
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Aliases</Label>
                                                            <div
                                                                className="flex flex-wrap overflow-y-auto mb-2 gap-1">
                                                                {aliases.map((alias, index) => (
                                                                    <div key={index}
                                                                         className="flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                        <>
                                                                            {getRelatedCharacter(alias) &&
                                                                                <img
                                                                                    src={getRelatedCharacter(alias)}
                                                                                    alt={"Relationship"}
                                                                                    className={"size-5 object-cover rounded-full ml-1"}/>
                                                                            }
                                                                        </>
                                                                        <div
                                                                            className={"px-1 text-sm"}>
                                                                            {alias}</div>
                                                                        <button
                                                                            onClick={() => removeArrayItem(setAliases, aliases, index)}
                                                                            className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition mr-1"
                                                                        >
                                                                            <FiXCircle/>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className={"flex relative"}>
                                                                <Input
                                                                    value={newAlias}
                                                                    onSubmit={() => addItemToArray(setAliases, aliases, newAlias, setNewAlias)}
                                                                    onChange={(e) => setNewAlias(e.target.value)}
                                                                    className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Alias or nickname"
                                                                />
                                                                <button
                                                                    onClick={() => addItemToArray(setAliases, aliases, newAlias, setNewAlias)}
                                                                    className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                >
                                                                    <IoAddCircleOutline className={"text-lg"}/>
                                                                </button>
                                                            </div>
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* ROLE & DEMOGRAPHICS SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                {/*<h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">*/}
                                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"*/}
                                                {/*         viewBox="0 0 20 20" fill="currentColor">*/}
                                                {/*        <path*/}
                                                {/*            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>*/}
                                                {/*    </svg>*/}
                                                {/*    Role & Demographics*/}
                                                {/*</h3>*/}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset
                                                        className="">
                                                        <div
                                                            className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Role
                                                                    type</Label>
                                                                <Input
                                                                    value={role.type}
                                                                    onChange={(e) => setRole({
                                                                        ...role,
                                                                        type: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Protagonist, Antagonist, Sidekick, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Role
                                                                    importance</Label>
                                                                <select
                                                                    value={role.importance}
                                                                    onChange={(e) => setRole({
                                                                        ...role,
                                                                        importance: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                >
                                                                    <option value="">Select importance</option>
                                                                    <option value="primary">Primary (Central to the main
                                                                        plot)
                                                                    </option>
                                                                    <option value="secondary">Secondary (Supporting
                                                                        character)
                                                                    </option>
                                                                    <option value="minor">Minor (Limited impact)
                                                                    </option>
                                                                    <option value="background">Background (Minimal
                                                                        influence)
                                                                    </option>
                                                                </select>
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Character
                                                                    Type</Label>
                                                                <select
                                                                    value={role.dynamic_static}
                                                                    onChange={(e) => setRole({
                                                                        ...role,
                                                                        dynamic_static: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                >
                                                                    <option value="">Select character type</option>
                                                                    <option value="dynamic">Dynamic (Changes throughout
                                                                        story)
                                                                    </option>
                                                                    <option value="static">Static (Remains the same)
                                                                    </option>
                                                                    <option value="round">Round (Complex,
                                                                        well-developed)
                                                                    </option>
                                                                    <option value="flat">Flat (One-dimensional)</option>
                                                                    <option value="stock">Stock (Archetypal)</option>
                                                                    <option value="symbolic">Symbolic (Represents
                                                                        concepts)
                                                                    </option>
                                                                </select>
                                                            </Field>
                                                        </div>
                                                    </Fieldset>

                                                    <Fieldset
                                                        className="">

                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Age</Label>
                                                                <Input
                                                                    value={demographics.age}
                                                                    onChange={(e) => setDemographics({
                                                                        ...demographics,
                                                                        age: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Character's age"
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Gender</Label>
                                                                <Input
                                                                    value={demographics.gender}
                                                                    onChange={(e) => setDemographics({
                                                                        ...demographics,
                                                                        gender: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Character's gender"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Ethnicity</Label>
                                                                <Input
                                                                    value={demographics.ethnicity}
                                                                    onChange={(e) => setDemographics({
                                                                        ...demographics,
                                                                        ethnicity: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Character's ethnicity"
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Nationality</Label>
                                                                <Input
                                                                    value={demographics.nationality}
                                                                    onChange={(e) => setDemographics({
                                                                        ...demographics,
                                                                        nationality: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Character's nationality"
                                                                />
                                                            </Field>
                                                        </div>
                                                    </Fieldset>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* APPEARANCE & PERSONALITY SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                {/*<h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">*/}
                                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"*/}
                                                {/*         viewBox="0 0 20 20" fill="currentColor">*/}
                                                {/*        <path fillRule="evenodd"*/}
                                                {/*              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"*/}
                                                {/*              clipRule="evenodd"/>*/}
                                                {/*    </svg>*/}
                                                {/*    Appearance & Personality*/}
                                                {/*</h3>*/}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset
                                                        className="">
                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Physical
                                                                    Appearance</Label>
                                                                <Textarea
                                                                    value={appearance.physical}
                                                                    onChange={(e) => setAppearance({
                                                                        ...appearance,
                                                                        physical: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe physical features"
                                                                    rows={4}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Attire
                                                                    & Style</Label>
                                                                <Textarea
                                                                    value={appearance.attire}
                                                                    onChange={(e) => setAppearance({
                                                                        ...appearance,
                                                                        attire: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe clothing and style"
                                                                    rows={4}
                                                                />
                                                            </Field>
                                                        </div>
                                                    </Fieldset>
                                                    <Fieldset
                                                        className="">
                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Personality
                                                                    Traits</Label>
                                                                <div
                                                                    className="flex flex-wrap mb-2 gap-1 max-h-[120px] overflow-y-auto">
                                                                    {personality.traits && personality.traits.length > 0 &&
                                                                        <>
                                                                            {personality.traits.map((trait, index) => (
                                                                                <div key={index}
                                                                                     className="flex items-center gap-2  py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                                    <div
                                                                                        className={"px-2 text-sm"}>
                                                                                        {trait}</div>
                                                                                    <button
                                                                                        onClick={() => removeArrayItem(
                                                                                            (newTraits) => setPersonality({
                                                                                                ...personality,
                                                                                                traits: newTraits
                                                                                            }),
                                                                                            personality.traits,
                                                                                            index
                                                                                        )}
                                                                                        className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition mr-2"
                                                                                    >
                                                                                        <FiXCircle/>
                                                                                    </button>

                                                                                </div>
                                                                            ))}
                                                                        </>
                                                                    }

                                                                </div>
                                                                <div className={"flex relative"}>
                                                                    <Input
                                                                        value={newTrait}
                                                                        onChange={(e) => setNewTrait(e.target.value)}
                                                                        className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Trait"
                                                                    />
                                                                    <button
                                                                        onClick={() => addItemToArray((newTraits) => setPersonality({
                                                                                ...personality,
                                                                                traits: newTraits
                                                                            }),
                                                                            personality.traits,
                                                                            newTrait,
                                                                            setNewTrait
                                                                        )}
                                                                        className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                    >
                                                                        <IoAddCircleOutline className={"text-lg"}/>
                                                                    </button>
                                                                </div>

                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Motivations</Label>
                                                                <div
                                                                    className="mb-2 flex-col max-h-[120px] overflow-y-auto">
                                                                    {personality.motivations && personality.motivations.length > 0 && <>
                                                                        {personality.motivations.map((motivation, index) => (

                                                                            <div key={index}
                                                                                 className="flex items-center justify-between mb-1  py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                                <div
                                                                                    className={"px-2 text-sm"}>
                                                                                    {motivation}</div>
                                                                                <button
                                                                                    onClick={() => removeArrayItem(
                                                                                        (newMotivations) => setPersonality({
                                                                                            ...personality,
                                                                                            motivations: newMotivations
                                                                                        }),
                                                                                        personality.motivations,
                                                                                        index
                                                                                    )}
                                                                                    className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition mr-2"
                                                                                >
                                                                                    <FiXCircle/>
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </>}

                                                                </div>
                                                                <div className={"flex relative"}>
                                                                    <Input
                                                                        value={newMotivation}
                                                                        onChange={(e) => setNewMotivation(e.target.value)}
                                                                        className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Motivation"
                                                                    />
                                                                    <button
                                                                        onClick={() => addItemToArray(
                                                                            (newMotivations) => setPersonality({
                                                                                ...personality,
                                                                                motivations: newMotivations
                                                                            }),
                                                                            personality.motivations,
                                                                            newMotivation,
                                                                            setNewMotivation
                                                                        )}
                                                                        className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                    >
                                                                        <IoAddCircleOutline className={"text-lg"}/>
                                                                    </button>
                                                                </div>
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Flaws</Label>
                                                                <div
                                                                    className="flex gap-1 flex-wrap mb-2 max-h-[120px] overflow-y-auto">
                                                                    {personality.flaws && personality.flaws.length > 0 && <>
                                                                        {personality.flaws.map((flaw, index) => (

                                                                            <div key={index}
                                                                                 className="flex items-center justify-between mb-1  py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                                <div
                                                                                    className={"px-2 text-sm"}>
                                                                                    {flaw}</div>
                                                                                <button
                                                                                    onClick={() => removeArrayItem(
                                                                                        (newFlaws) => setPersonality({
                                                                                            ...personality,
                                                                                            flaws: newFlaws
                                                                                        }),
                                                                                        personality.flaws,
                                                                                        index
                                                                                    )}
                                                                                    className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition mr-2"
                                                                                >
                                                                                    <FiXCircle/>
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </>}

                                                                </div>
                                                                <div className={"flex relative"}>
                                                                    <Input
                                                                        value={newFlaw}
                                                                        onChange={(e) => setNewFlaw(e.target.value)}
                                                                        className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Flaw"
                                                                    />
                                                                    <button
                                                                        onClick={() => addItemToArray(
                                                                            (newFlaws) => setPersonality({
                                                                                ...personality,
                                                                                flaws: newFlaws
                                                                            }),
                                                                            personality.flaws,
                                                                            newFlaw,
                                                                            setNewFlaw
                                                                        )}
                                                                        className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                    >
                                                                        <IoAddCircleOutline className={"text-lg"}/>
                                                                    </button>
                                                                </div>
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Moral
                                                                    Alignment</Label>
                                                                <select
                                                                    value={personality.moral_alignment}
                                                                    onChange={(e) => setPersonality({
                                                                        ...personality,
                                                                        moral_alignment: e.target.value
                                                                    })}
                                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                >
                                                                    <option value="">Select alignment</option>
                                                                    <option value="Lawful Good">Lawful Good</option>
                                                                    <option value="Neutral Good">Neutral Good</option>
                                                                    <option value="Chaotic Good">Chaotic Good</option>
                                                                    <option value="Lawful Neutral">Lawful Neutral
                                                                    </option>
                                                                    <option value="True Neutral">True Neutral</option>
                                                                    <option value="Chaotic Neutral">Chaotic Neutral
                                                                    </option>
                                                                    <option value="Lawful Evil">Lawful Evil</option>
                                                                    <option value="Neutral Evil">Neutral Evil</option>
                                                                    <option value="Chaotic Evil">Chaotic Evil</option>
                                                                </select>
                                                            </Field>
                                                        </div>
                                                    </Fieldset>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* BACKSTORY & RELATIONSHIPS SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                {/*<h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">*/}
                                                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2"*/}
                                                {/*         viewBox="0 0 20 20" fill="currentColor">*/}
                                                {/*        <path fillRule="evenodd"*/}
                                                {/*              d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"*/}
                                                {/*              clipRule="evenodd"/>*/}
                                                {/*        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"/>*/}
                                                {/*    </svg>*/}
                                                {/*    Backstory & Relationships*/}
                                                {/*</h3>*/}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset
                                                        className="">
                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1  text-gray-700">Key
                                                                    Events</Label>
                                                                <div className="mb-2 max-h-[160px] overflow-y-auto">
                                                                    {backstory.key_events && backstory.key_events.length > 0 && <>
                                                                        <p className="block text-xs font-medium font-semibold pb-1 text-gray-700">Events</p>
                                                                        {backstory.key_events.map((event, index) => (
                                                                            <div key={index}
                                                                                 className="flex items-center justify-between mb-1  py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                                <div
                                                                                    className={"px-2 text-sm"}>
                                                                                    {event}</div>

                                                                                <button
                                                                                    onClick={() => removeArrayItem(
                                                                                        (newEvents) => setBackstory({
                                                                                            ...backstory,
                                                                                            key_events: newEvents
                                                                                        }),
                                                                                        backstory.key_events,
                                                                                        index
                                                                                    )}
                                                                                    className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition mr-2"
                                                                                >
                                                                                    <FiXCircle/>
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </>}

                                                                </div>
                                                                <div className={"flex relative"}>
                                                                    <Input
                                                                        value={newEvent}
                                                                        onChange={(e) => setNewEvent(e.target.value)}
                                                                        className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Event"
                                                                    />
                                                                    <button
                                                                        onClick={() => addItemToArray(
                                                                            (newEvents) => setBackstory({
                                                                                ...backstory,
                                                                                key_events: newEvents
                                                                            }),
                                                                            backstory.key_events,
                                                                            newEvent,
                                                                            setNewEvent
                                                                        )}
                                                                        className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                    >
                                                                        <IoAddCircleOutline className={"text-lg"}/>
                                                                    </button>
                                                                </div>

                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1  text-gray-700">Cultural
                                                                    Context</Label>
                                                                <Textarea
                                                                    value={backstory.cultural_context}
                                                                    onChange={(e) => setBackstory({
                                                                        ...backstory,
                                                                        cultural_context: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe the cultural context/background"
                                                                    rows={4}
                                                                />
                                                            </Field>
                                                        </div>
                                                    </Fieldset>

                                                    <Fieldset
                                                        className="">
                                                        <Label
                                                            className="block text-sm font-medium font-semibold pb-1  text-gray-700">Relationships</Label>
                                                        <div
                                                            className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-">
                                                            {relationships && relationships.length > 0 &&
                                                                <>
                                                                    {relationships.map((rel, index) => (
                                                                        <div key={index}
                                                                             className="flex items-start justify-between p-2 bg-white rounded-md border border-indigo-100 mb-2">
                                                                            <div className={"flex gap-1"}>
                                                                                <div>
                                                                                    <>{getRelatedCharacter(rel.name) ?
                                                                                        <img
                                                                                            src={getRelatedCharacter(rel.name)}
                                                                                            alt={"Relationship"}
                                                                                            className={"size-14 object-cover rounded-sm"}/> :
                                                                                        <div
                                                                                            className={"size-14 bg-zinc-100 rounded-md"}></div>}
                                                                                    </>
                                                                                </div>
                                                                                <div className="">
                                                                                    <p className={"text-sm text-zinc-700"}>{rel.name}</p>
                                                                                    <p className={"text-xs text-zinc-500"}>{rel.relation}</p>
                                                                                    <p className={"text-xs text-zinc-500"}>{rel.dynamic}</p>

                                                                                </div>
                                                                            </div>

                                                                            <button
                                                                                onClick={() => removeRelationship(index)}
                                                                                className=" text-zinc-400 hover:text-zinc-700 text-lg rounded-full  transition"
                                                                            >
                                                                                <FiXCircle/>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </>}


                                                        </div>
                                                        <div>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Name</Label>
                                                                <Input
                                                                    value={relationshipName}
                                                                    onChange={(e) => setRelationshipName(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Character name"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 pt-2 text-gray-700">Relation</Label>
                                                                <Input
                                                                    value={relRelation}
                                                                    onChange={(e) => setRelRelation(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Friend, Enemy, Parent, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 pt-2 text-gray-700">Dynamic</Label>
                                                                <Textarea
                                                                    value={relDynamic}
                                                                    onChange={(e) => setRelDynamic(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe the relationship dynamic"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                        </div>
                                                        <button
                                                            onClick={addRelationship}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 className="h-4 w-4 mr-1"
                                                                 viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd"
                                                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                            Add Relationship
                                                        </button>
                                                    </Fieldset>
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
                                    onClick={() => setIsCreateCharacterOpen(false)}
                                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveCharacter}
                                    className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all transform hover:scale-[1.02]"
                                >
                                    Save Character
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default CreateCharacterDialog;
