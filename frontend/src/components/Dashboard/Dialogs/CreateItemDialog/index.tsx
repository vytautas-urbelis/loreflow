import {Dialog, DialogPanel, Field, Fieldset, Input, Label, Tab, Textarea} from '@headlessui/react';
import {useState} from "react";
import {useParams} from "react-router";
import {ItemInterface} from "../../../../models/item/item.ts";
import {DeleteItemImage, SaveNewItem, UpdateItem} from "../../../../axios/Item.ts";
import {FiXCircle} from "react-icons/fi";
import {IoAddCircleOutline} from "react-icons/io5";
import {ProjectInterface} from "../../../../models/project";
import {EmptyItem} from "../../../../models/item/item.tsx";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";


const CreateItemDialog = ({
                              isCreateItemOpen,
                              setIsCreateItemOpen,
                              item = EmptyItem(),
                              project
                          }: {
    isCreateItemOpen: boolean,
    setIsCreateItemOpen: React.Dispatch<React.SetStateAction<boolean>>,
    item: ItemInterface,
    project: ProjectInterface,
}) => {
    // Basic information states
    const [name, setName] = useState<string>(item.name);
    const [imageToSend, setImageToSend] = useState<File | null | string>(item.image ? item.image : null);
    const [imageToShow, setImageToShow] = useState<string | null | undefined>(item.image);
    const [category, setCategory] = useState<string>(item.category || '');
    const [description, setDescription] = useState<string>(item.description || '');
    const [symbolism, setSymbolism] = useState<string>(item.symbolism || '');

    // Properties states
    const [material, setMaterial] = useState<string>(item.properties?.material || '');
    const [size, setSize] = useState<string>(item.properties?.size || '');
    const [appearance, setAppearance] = useState<string>(item.properties?.appearance || '');
    const [uniqueTraits, setUniqueTraits] = useState<string>(item.properties?.unique_traits || '');

    // History states
    const [origin, setOrigin] = useState<string>(item.history?.origin || '');
    const [age, setAge] = useState<string>(item.history?.age || '');
    const [creator, setCreator] = useState<string>(item.history?.creator || '');
    const [previousEvents, setPreviousEvents] = useState<string[]>(item.history?.previous_events || []);
    const [newEvent, setNewEvent] = useState<string>('');

    // Abilities states
    const [abilities, setAbilities] = useState<{ ability: string }[]>(item.abilities || []);
    const [newAbility, setNewAbility] = useState<string>('');

    // Ownership states
    const [ownership, setOwnership] = useState<{
        character: string,
        acquisition: string,
        significance: string
    }[]>(item.ownership || []);
    const [ownerCharacter, setOwnerCharacter] = useState<string>('');
    const [ownerAcquisition, setOwnerAcquisition] = useState<string>('');
    const [ownerSignificance, setOwnerSignificance] = useState<string>('');

    // Significance states
    const [plotRelevance, setPlotRelevance] = useState<string>(item.significance?.plot_relevance || '');
    const [storyFunction, setStoryFunction] = useState<string>(item.significance?.story_function || '');
    const [symbolicMeaning, setSymbolicMeaning] = useState<string>(item.significance?.symbolic_meaning || '');

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();

    // Hooks for state management
    const updateItemInProject = useProjectsStore((state) => state.updateItemInProject);
    const addItemToProject = useProjectsStore((state) => state.addItemToProject);


    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImageToSend(file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageToShow(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Helper functions for array operations
    const addItemToArray = (
        setter: (array: any[]) => void,
        array: any[],
        defaultValue: any,
        cleaner: (array: any) => void,
    ) => {
        if (!defaultValue.trim()) return;
        setter([...array, defaultValue]);
        cleaner('');
    };

    const removeArrayItem = <T, >(
        setter: (array: T[]) => void,
        array: T[],
        index: number,
    ) => {
        setter(array.filter((_, i) => i !== index));
    };

    // Add ability to the abilities array
    const addAbility = () => {
        if (!newAbility.trim()) return;
        setAbilities([...abilities, {ability: newAbility}]);
        setNewAbility('');
    };

    // Add owner to the ownership array
    const addOwnership = () => {
        if (!ownerCharacter.trim()) return;
        setOwnership([...ownership, {
            character: ownerCharacter,
            acquisition: ownerAcquisition,
            significance: ownerSignificance
        }]);
        setOwnerCharacter('');
        setOwnerAcquisition('');
        setOwnerSignificance('');
    };

    // Find character images for relationship display
    const getRelatedCharacter = (characterName: string) => {
        const character = project.characters.find(item => item.name.toLowerCase() === characterName.toLowerCase());
        if (character && character.image) {
            return character.image;
        }
        return undefined;
    };

    // Update existing item
    const handleUpdateItem = async (formData: FormData, item: ItemInterface): Promise<void> => {
        if (item.id) {
            if (imageToSend === null) {
                await DeleteItemImage(accessToken, item.id);
            }
            const response = await UpdateItem(accessToken, formData, item.id);
            if (id) {
                updateItemInProject(id, response.data);
            }
        }
    };

    // Create new item
    const handleCreateItem = async (formData: FormData): Promise<void> => {
        const response = await SaveNewItem(accessToken, formData);
        handleCleanForm();
        if (id) {
            addItemToProject(id, response.data);
        }
    };

    // Reset form fields
    const handleCleanForm = () => {
        setName('');
        setImageToSend(null);
        setImageToShow(null);
        setCategory('');
        setDescription('');
        setSymbolism('');
        setMaterial('');
        setSize('');
        setAppearance('');
        setUniqueTraits('');
        setOrigin('');
        setAge('');
        setCreator('');
        setPreviousEvents([]);
        setAbilities([]);
        setOwnership([]);
        setPlotRelevance('');
        setStoryFunction('');
        setSymbolicMeaning('');
    };

    // Main save function
    const saveItem = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category || '');
            formData.append("description", description || '');
            formData.append("symbolism", symbolism || '');

            // Prepare properties object
            const properties = {
                material,
                size,
                appearance,
                unique_traits: uniqueTraits
            };
            formData.append("properties", JSON.stringify(properties));

            // Prepare history object
            const history = {
                origin,
                age,
                creator,
                previous_events: previousEvents
            };
            formData.append("history", JSON.stringify(history));

            // Prepare abilities and ownership
            formData.append("abilities", JSON.stringify(abilities));
            formData.append("ownership", JSON.stringify(ownership));

            // Prepare significance object
            const significance = {
                plot_relevance: plotRelevance,
                story_function: storyFunction,
                symbolic_meaning: symbolicMeaning
            };
            formData.append("significance", JSON.stringify(significance));

            // Project ID
            formData.append("project", id ? id : '');

            // Image handling
            if (imageToSend !== null && (typeof imageToSend) !== "string") {
                formData.append("image", imageToSend);
            }

            // Handle update or create based on item ID existence
            if (item.id) {
                await handleUpdateItem(formData, item);
            } else {
                await handleCreateItem(formData);
            }
            setIsCreateItemOpen(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Dialog
            open={isCreateItemOpen}
            onClose={() => setIsCreateItemOpen(false)}
            transition
            className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
        >
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition className="w-fit max-w-3xl">
                    <div className="bg-white rounded-sm border border-zinc-300 shadow-2xl">
                        <div className="bg-white rounded-lg shadow-inner overflow-hidden w-fit">
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                    {item.name ? `${item.name}` : 'Create New Item'}
                                </h2>
                            </div>

                            {/* Tabs navigation */}
                            <div className="max-h-[75vh] overflow-y-auto">
                                <Tab.Group>
                                    <Tab.List className="flex space-x-1 border-b border-zinc-200 px-4 py-2">
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-md transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            <p>Basic Information</p>
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-md transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Properties
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            History
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Abilities & Ownership
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Significance
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels
                                        className="p-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">
                                        {/* BASIC INFO TAB */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Item Name
                                                            </Label>
                                                            <Input
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Enter item name"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Category
                                                            </Label>
                                                            <Input
                                                                value={category}
                                                                onChange={(e) => setCategory(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Enter item category"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Description
                                                            </Label>
                                                            <Textarea
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Describe the item"
                                                                rows={4}
                                                            />
                                                        </Field>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Item Image
                                                            </Label>
                                                            <div className="flex items-center">
                                                                {imageToShow ? (
                                                                    <div
                                                                        className="relative w-32 h-32 overflow-hidden rounded-md border-2 border-indigo-200 shadow-sm">
                                                                        <img src={imageToShow} alt={name}
                                                                             className="object-cover w-full h-full"/>
                                                                        <button
                                                                            onClick={() => {
                                                                                setImageToShow(null)
                                                                                setImageToSend(null)
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
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Symbolism
                                                            </Label>
                                                            <Textarea
                                                                value={symbolism}
                                                                onChange={(e) => setSymbolism(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What does this item symbolize?"
                                                                rows={4}
                                                            />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* PROPERTIES TAB */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Material
                                                            </Label>
                                                            <Input
                                                                value={material}
                                                                onChange={(e) => setMaterial(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What is it made of?"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Size
                                                            </Label>
                                                            <Input
                                                                value={size}
                                                                onChange={(e) => setSize(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="How big is it?"
                                                            />
                                                        </Field>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Appearance
                                                            </Label>
                                                            <Textarea
                                                                value={appearance}
                                                                onChange={(e) => setAppearance(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Describe how it looks"
                                                                rows={4}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Unique Traits
                                                            </Label>
                                                            <Textarea
                                                                value={uniqueTraits}
                                                                onChange={(e) => setUniqueTraits(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What makes this item special?"
                                                                rows={4}
                                                            />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* HISTORY TAB */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Origin
                                                            </Label>
                                                            <Textarea
                                                                value={origin}
                                                                onChange={(e) => setOrigin(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Where did it come from?"
                                                                rows={4}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Age
                                                            </Label>
                                                            <Input
                                                                value={age}
                                                                onChange={(e) => setAge(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="How old is it?"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Creator
                                                            </Label>
                                                            <Input
                                                                value={creator}
                                                                onChange={(e) => setCreator(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Who made it?"
                                                            />
                                                        </Field>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Previous Events
                                                            </Label>
                                                            <div className="mb-2 max-h-[160px] overflow-y-auto">
                                                                {previousEvents.map((event, index) => (
                                                                    <div key={index}
                                                                         className="flex items-center justify-between mb-1 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                        <div className="px-2 text-sm">
                                                                            {event}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => removeArrayItem(setPreviousEvents, previousEvents, index)}
                                                                            className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition mr-2"
                                                                        >
                                                                            <FiXCircle/>
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex relative">
                                                                <Input
                                                                    value={newEvent}
                                                                    onChange={(e) => setNewEvent(e.target.value)}
                                                                    className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Add significant event"
                                                                />
                                                                <button
                                                                    onClick={() => addItemToArray(setPreviousEvents, previousEvents, newEvent, setNewEvent)}
                                                                    className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                                >
                                                                    <IoAddCircleOutline className="text-lg"/>
                                                                </button>
                                                            </div>
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* ABILITIES & OWNERSHIP TAB */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset>
                                                        <Label
                                                            className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                            Abilities
                                                        </Label>
                                                        <div className="mb-2 max-h-[160px] overflow-y-auto">
                                                            {abilities.map((ability, index) => (
                                                                <div key={index}
                                                                     className="flex items-center justify-between mb-1 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-100 rounded-lg">
                                                                    <div className="px-2 text-sm">
                                                                        {ability.ability}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeArrayItem(setAbilities, abilities, index)}
                                                                        className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition mr-2"
                                                                    >
                                                                        <FiXCircle/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex relative">
                                                            <Input
                                                                value={newAbility}
                                                                onChange={(e) => setNewAbility(e.target.value)}
                                                                className="bg-white flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What can this item do?"
                                                            />
                                                            <button
                                                                onClick={addAbility}
                                                                className="bg-zinc-500 text-white rounded-full hover:bg-green-600 transition absolute right-2 top-3"
                                                            >
                                                                <IoAddCircleOutline className="text-lg"/>
                                                            </button>
                                                        </div>
                                                    </Fieldset>

                                                    <Fieldset>
                                                        <Label
                                                            className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                            Ownership
                                                        </Label>
                                                        <div
                                                            className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {ownership.map((owner, index) => (
                                                                <div key={index}
                                                                     className="flex items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                    <div className="flex gap-1">
                                                                        <div>
                                                                            {getRelatedCharacter(owner.character) ? (
                                                                                <img
                                                                                    src={getRelatedCharacter(owner.character)}
                                                                                    alt="Owner"
                                                                                    className="size-14 object-cover rounded-sm"
                                                                                />
                                                                            ) : (
                                                                                <div
                                                                                    className="size-14 bg-zinc-100 rounded-md"></div>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-zinc-700">{owner.character}</p>
                                                                            <p className="text-xs text-zinc-500">{owner.acquisition}</p>
                                                                            <p className="text-xs text-zinc-500">{owner.significance}</p>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeArrayItem(setOwnership, ownership, index)}
                                                                        className="text-zinc-400 hover:text-zinc-700 text-lg rounded-full transition"
                                                                    >
                                                                        <FiXCircle/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 pt-2 text-gray-700">
                                                                    Character
                                                                </Label>
                                                                <Input
                                                                    value={ownerCharacter}
                                                                    onChange={(e) => setOwnerCharacter(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Who owns it?"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 pt-2 text-gray-700">
                                                                    Acquisition
                                                                </Label>
                                                                <Input
                                                                    value={ownerAcquisition}
                                                                    onChange={(e) => setOwnerAcquisition(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="How was it acquired?"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 pt-2 text-gray-700">
                                                                    Significance
                                                                </Label>
                                                                <Textarea
                                                                    value={ownerSignificance}
                                                                    onChange={(e) => setOwnerSignificance(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Why is it important to this character?"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                        </div>
                                                        <button
                                                            onClick={addOwnership}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 className="h-4 w-4 mr-1"
                                                                 viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd"
                                                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                            Add Owner
                                                        </button>
                                                    </Fieldset>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* SIGNIFICANCE TAB */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-4">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Plot Relevance
                                                            </Label>
                                                            <Textarea
                                                                value={plotRelevance}
                                                                onChange={(e) => setPlotRelevance(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="How does this item affect the plot?"
                                                                rows={4}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Story Function
                                                            </Label>
                                                            <Textarea
                                                                value={storyFunction}
                                                                onChange={(e) => setStoryFunction(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What role does this item play in the story?"
                                                                rows={4}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">
                                                                Symbolic Meaning
                                                            </Label>
                                                            <Textarea
                                                                value={symbolicMeaning}
                                                                onChange={(e) => setSymbolicMeaning(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="What deeper meaning does this item represent?"
                                                                rows={4}
                                                            />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>

                            {/* Action buttons */}
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100 flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsCreateItemOpen(false)}
                                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveItem}
                                    className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all transform hover:scale-[1.02]"
                                >
                                    Save Item
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default CreateItemDialog;
