import {Dialog, DialogPanel, Field, Fieldset, Input, Label, Tab, Textarea} from '@headlessui/react';
import {useState} from "react";
import {useParams} from "react-router";
import {EmptyLocation, LocationInterface} from "../../../../models/location/location";
import {DeleteLocationImage, SaveNewLocation, UpdateLocation} from "../../../../axios/Location.ts";
import {FiXCircle} from "react-icons/fi";
import {IoAddCircleOutline} from "react-icons/io5";
import {ProjectInterface} from "../../../../models/project";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";

const CreateLocationDialog = ({
                                  isCreateLocationOpen,
                                  setIsCreateLocationOpen,
                                  location = EmptyLocation(),
                                  project
                              }: {
    isCreateLocationOpen: boolean,
    setIsCreateLocationOpen: React.Dispatch<React.SetStateAction<boolean>>,
    location: LocationInterface,
    project: ProjectInterface,
}) => {

    // Basic Information States
    const [name, setName] = useState<string>(location.name);
    const [imageToSend, setImageTooSend] = useState<File | null | string>(location.image ? location.image : null);
    const [imageToShow, setImageToShow] = useState<string | null | undefined>(location.image);
    const [description, setDescription] = useState<string>(location.description || '');
    const [symbolism, setSymbolism] = useState<string>(location.symbolism || '');
    const [type, setType] = useState<string>(location.type || '');

    // Geography & Culture States
    const [geography, setGeography] = useState(location.geography_details);
    const [culture, setCulture] = useState(location.culture_details);

    // Historical Events States
    const [historicalEvents, setHistoricalEvents] = useState(location.historical_events);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventSignificance, setNewEventSignificance] = useState('');

    // Points of Interest States
    const [pointsOfInterest, setPointsOfInterest] = useState(location.points_of_interest);
    const [newPoiName, setNewPoiName] = useState('');
    const [newPoiDescription, setNewPoiDescription] = useState('');
    const [newPoiSignificance, setNewPoiSignificance] = useState('');

    // Inhabitants States
    const [inhabitants, setInhabitants] = useState(location.inhabitants_list);
    const [newInhabitantName, setNewInhabitantName] = useState('');
    const [newInhabitantRole, setNewInhabitantRole] = useState('');
    const [newInhabitantDescription, setNewInhabitantDescription] = useState('');

    // Atmosphere States
    const [atmosphere, setAtmosphere] = useState(location.atmosphere_details);

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();

    // Hooks for state management
    const updateLocationInProject = useProjectsStore((state) => state.updateLocationInProject);
    const addLocationToProject = useProjectsStore((state) => state.addLocationToProject);

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

    // Get realated character
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

    // Utility Functions
    const addHistoricalEvent = () => {
        if (newEventTitle) {
            const newEvent = {
                title: newEventTitle,
                date: newEventDate,
                description: newEventDescription,
                significance: newEventSignificance
            };
            setHistoricalEvents([...historicalEvents, newEvent]);
            setNewEventTitle('');
            setNewEventDate('');
            setNewEventDescription('');
            setNewEventSignificance('');
        }
    };

    const removeHistoricalEvent = (index: number) => {
        setHistoricalEvents(historicalEvents.filter((_, i) => i !== index));
    };

    const addPointOfInterest = () => {
        if (newPoiName) {
            const newPoi = {
                name: newPoiName,
                description: newPoiDescription,
                significance: newPoiSignificance
            };
            setPointsOfInterest([...pointsOfInterest, newPoi]);
            setNewPoiName('');
            setNewPoiDescription('');
            setNewPoiSignificance('');
        }
    };

    const removePointOfInterest = (index: number) => {
        setPointsOfInterest(pointsOfInterest.filter((_, i) => i !== index));
    };

    const addInhabitant = () => {
        if (newInhabitantName) {
            const newInhabitant = {
                name: newInhabitantName,
                role: newInhabitantRole,
                description: newInhabitantDescription
            };
            setInhabitants([...inhabitants, newInhabitant]);
            setNewInhabitantName('');
            setNewInhabitantRole('');
            setNewInhabitantDescription('');
        }
    };

    const removeInhabitant = (index: number) => {
        setInhabitants(inhabitants.filter((_, i) => i !== index));
    };

    const handleUpdateLocation = async (formData: FormData, location: LocationInterface): Promise<void> => {
        if (location.id) {
            if (imageToSend === null) {
                await DeleteLocationImage(accessToken, location.id);
            }
            const response = await UpdateLocation(accessToken, formData, location.id);
            if (id) {
                updateLocationInProject(id, response.data);
            }
        }
    };

    const handleCreateLocation = async (formData: FormData): Promise<void> => {
        const response = await SaveNewLocation(accessToken, formData);
        handleCleanForm();
        if (id) {
            addLocationToProject(id, response.data);
        }
    };

    const handleCleanForm = () => {
        setName('');
        setImageTooSend(null);
        setImageToShow(null);
        setDescription('');
        setSymbolism('');
        setType('');
        setGeography({});
        setCulture({});
        setHistoricalEvents([]);
        setPointsOfInterest([]);
        setInhabitants([]);
        setAtmosphere({});
    };

    // Main Save Function
    const saveLocation = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("symbolism", symbolism);
            formData.append("type", type);

            formData.append("geography_details", JSON.stringify(geography));
            formData.append("culture_details", JSON.stringify(culture));
            formData.append("historical_events", JSON.stringify(historicalEvents));
            formData.append("points_of_interest", JSON.stringify(pointsOfInterest));
            formData.append("inhabitants_list", JSON.stringify(inhabitants));
            formData.append("atmosphere_details", JSON.stringify(atmosphere));

            formData.append("project", id ? id : '');

            if (imageToSend !== null && (typeof imageToSend) !== "string") {
                formData.append("image", imageToSend);
            }

            // Updating location
            if (location.id) {
                await handleUpdateLocation(formData, location);
            } else {
                await handleCreateLocation(formData);
            }
            setIsCreateLocationOpen(false);

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Dialog
            open={isCreateLocationOpen}
            onClose={() => setIsCreateLocationOpen(false)}
            transition
            className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
        >
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition className="w-fit max-w-3xl">
                    <div className="bg-white rounded-sm border border-zinc-300  shadow-2xl">
                        <div className="bg-white rounded-lg shadow-inner overflow-hidden w-fit">
                            <div
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                    {location.name ? `${location.name}` : 'Create New Location'}
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
                                            Geography & Culture
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900'
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Historical Events & POIs
                                        </Tab>
                                        <Tab className={({selected}) =>
                                            `px-2 py-2 text-sm font-medium rounded-lg transition-all outline-none
                                            ${selected
                                                ? 'bg-zinc-100 text-zinc-900 '
                                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/[0.5]'}`
                                        }>
                                            Inhabitants & Atmosphere
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels
                                        className="p-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">

                                        {/* BASIC INFO SECTION */}
                                        <Tab.Panel>
                                            <section className="rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Location
                                                                Name</Label>
                                                            <Input
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                className="mb-2 text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Enter location name"
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                            <Textarea
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="Describe this location"
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
                                                                placeholder="What does this location symbolize?"
                                                                rows={3}
                                                            />
                                                        </Field>

                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Location
                                                                Type</Label>
                                                            <Input
                                                                value={type}
                                                                onChange={(e) => setType(e.target.value)}
                                                                className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                placeholder="City, Forest, Castle, etc."
                                                            />
                                                        </Field>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Field>
                                                            <Label
                                                                className="block text-sm font-medium font-semibold pb-1 text-gray-700">Location
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
                                                    </div>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* GEOGRAPHY & CULTURE SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Geography</Label>
                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Terrain</Label>
                                                                <Input
                                                                    value={geography.terrain || ''}
                                                                    onChange={(e) => setGeography({
                                                                        ...geography,
                                                                        terrain: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Mountains, plains, coastal, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Climate</Label>
                                                                <Input
                                                                    value={geography.climate || ''}
                                                                    onChange={(e) => setGeography({
                                                                        ...geography,
                                                                        climate: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Tropical, arid, temperate, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Flora</Label>
                                                                <Textarea
                                                                    value={geography.flora || ''}
                                                                    onChange={(e) => setGeography({
                                                                        ...geography,
                                                                        flora: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe plant life"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Fauna</Label>
                                                                <Textarea
                                                                    value={geography.fauna || ''}
                                                                    onChange={(e) => setGeography({
                                                                        ...geography,
                                                                        fauna: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe animal life"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Natural
                                                                    Resources</Label>
                                                                <Textarea
                                                                    value={geography.natural_resources || ''}
                                                                    onChange={(e) => setGeography({
                                                                        ...geography,
                                                                        natural_resources: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe available resources"
                                                                    rows={3}
                                                                />
                                                            </Field>
                                                        </div>
                                                    </Fieldset>

                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Culture</Label>
                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Language</Label>
                                                                <Input
                                                                    value={culture.language || ''}
                                                                    onChange={(e) => setCulture({
                                                                        ...culture,
                                                                        language: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Languages spoken here"
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Customs</Label>
                                                                <Textarea
                                                                    value={culture.customs || ''}
                                                                    onChange={(e) => setCulture({
                                                                        ...culture,
                                                                        customs: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe local customs"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Religion</Label>
                                                                <Textarea
                                                                    value={culture.religion || ''}
                                                                    onChange={(e) => setCulture({
                                                                        ...culture,
                                                                        religion: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe religious practices"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Social
                                                                    Structure</Label>
                                                                <Textarea
                                                                    value={culture.social_structure || ''}
                                                                    onChange={(e) => setCulture({
                                                                        ...culture,
                                                                        social_structure: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe societal organization"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Arts</Label>
                                                                <Textarea
                                                                    value={culture.arts || ''}
                                                                    onChange={(e) => setCulture({
                                                                        ...culture,
                                                                        arts: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe artistic traditions"
                                                                    rows={3}
                                                                />
                                                            </Field>
                                                        </div>
                                                    </Fieldset>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* HISTORICAL EVENTS & POINTS OF INTEREST SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Historical
                                                            Events</Label>

                                                        <div
                                                            className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {historicalEvents.map((event, index) => (
                                                                <div key={index}
                                                                     className="flex items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-zinc-700">{event.title}</p>
                                                                        <p className="text-xs text-zinc-500">{event.date}</p>
                                                                        <p className="text-xs text-zinc-700">{event.description}</p>
                                                                        <p className="text-xs italic text-zinc-600">{event.significance}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeHistoricalEvent(index)}
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
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Title</Label>
                                                                <Input
                                                                    value={newEventTitle}
                                                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Event title"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Date</Label>
                                                                <Input
                                                                    value={newEventDate}
                                                                    onChange={(e) => setNewEventDate(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="When it occurred"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                <Textarea
                                                                    value={newEventDescription}
                                                                    onChange={(e) => setNewEventDescription(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="What happened"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Significance</Label>
                                                                <Textarea
                                                                    value={newEventSignificance}
                                                                    onChange={(e) => setNewEventSignificance(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Why it matters"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                        </div>

                                                        <button
                                                            onClick={addHistoricalEvent}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <IoAddCircleOutline className="mr-1"/>
                                                            Add Historical Event
                                                        </button>
                                                    </Fieldset>

                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Points
                                                            of Interest</Label>

                                                        <div
                                                            className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {pointsOfInterest.map((poi, index) => (
                                                                <div key={index}
                                                                     className="flex items-start justify-between p-2 bg-white rounded-md border border-indigo-100">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-zinc-700">{poi.name}</p>
                                                                        <p className="text-xs text-zinc-700">{poi.description}</p>
                                                                        <p className="text-xs italic text-zinc-600">{poi.significance}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removePointOfInterest(index)}
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
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Name</Label>
                                                                <Input
                                                                    value={newPoiName}
                                                                    onChange={(e) => setNewPoiName(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Point of interest name"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                <Textarea
                                                                    value={newPoiDescription}
                                                                    onChange={(e) => setNewPoiDescription(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe this location"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Significance</Label>
                                                                <Textarea
                                                                    value={newPoiSignificance}
                                                                    onChange={(e) => setNewPoiSignificance(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Why it matters"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                        </div>

                                                        <button
                                                            onClick={addPointOfInterest}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <IoAddCircleOutline className="mr-1"/>
                                                            Add Point of Interest
                                                        </button>
                                                    </Fieldset>
                                                </div>
                                            </section>
                                        </Tab.Panel>

                                        {/* INHABITANTS & ATMOSPHERE SECTION */}
                                        <Tab.Panel>
                                            <section className="">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Inhabitants</Label>

                                                        <div
                                                            className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-3">
                                                            {inhabitants.map((inhabitant, index) => (
                                                                <div key={index}
                                                                     className="flex gap-2 items-start justify-between p-2 bg-white rounded-md border border-indigo-100">

                                                                    <div>
                                                                        <>{getRelatedCharacter(inhabitant.name) ?
                                                                            <img
                                                                                src={getRelatedCharacter(inhabitant.name)}
                                                                                alt={"Relationship"}
                                                                                className={"size-14 object-cover rounded-sm"}/> :
                                                                            <div
                                                                                className={"size-14 bg-zinc-100 rounded-md"}></div>}
                                                                        </>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-semibold text-zinc-700">{inhabitant.name}</p>
                                                                        <p className="text-xs text-zinc-500">{inhabitant.role}</p>
                                                                        <p className="text-xs text-zinc-700">{inhabitant.description}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeInhabitant(index)}
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
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Name</Label>
                                                                <Input
                                                                    value={newInhabitantName}
                                                                    onChange={(e) => setNewInhabitantName(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Inhabitant name"
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Role</Label>
                                                                <Input
                                                                    value={newInhabitantRole}
                                                                    onChange={(e) => setNewInhabitantRole(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Leader, Merchant, etc."
                                                                />
                                                            </Field>
                                                            <Field>
                                                                <Label
                                                                    className="block text-xs font-medium font-semibold pb-1 text-gray-700">Description</Label>
                                                                <Textarea
                                                                    value={newInhabitantDescription}
                                                                    onChange={(e) => setNewInhabitantDescription(e.target.value)}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Brief description"
                                                                    rows={2}
                                                                />
                                                            </Field>
                                                        </div>

                                                        <button
                                                            onClick={addInhabitant}
                                                            className="w-full mt-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center justify-center"
                                                        >
                                                            <IoAddCircleOutline className="mr-1"/>
                                                            Add Inhabitant
                                                        </button>
                                                    </Fieldset>

                                                    <Fieldset className="">
                                                        <Label
                                                            className="block text-lg font-medium font-semibold pb-2 text-gray-700">Atmosphere</Label>

                                                        <div className="space-y-4">
                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Mood</Label>
                                                                <Input
                                                                    value={atmosphere.mood || ''}
                                                                    onChange={(e) => setAtmosphere({
                                                                        ...atmosphere,
                                                                        mood: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Serene, ominous, festive, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Lighting</Label>
                                                                <Input
                                                                    value={atmosphere.lighting || ''}
                                                                    onChange={(e) => setAtmosphere({
                                                                        ...atmosphere,
                                                                        lighting: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Bright, dim, filtered, etc."
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Sounds</Label>
                                                                <Textarea
                                                                    value={atmosphere.sounds || ''}
                                                                    onChange={(e) => setAtmosphere({
                                                                        ...atmosphere,
                                                                        sounds: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe what can be heard here"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">Smells</Label>
                                                                <Textarea
                                                                    value={atmosphere.smells || ''}
                                                                    onChange={(e) => setAtmosphere({
                                                                        ...atmosphere,
                                                                        smells: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Describe scents and odors"
                                                                    rows={3}
                                                                />
                                                            </Field>

                                                            <Field>
                                                                <Label
                                                                    className="block text-sm font-medium font-semibold pb-1 text-gray-700">General
                                                                    Feel</Label>
                                                                <Textarea
                                                                    value={atmosphere.general_feel || ''}
                                                                    onChange={(e) => setAtmosphere({
                                                                        ...atmosphere,
                                                                        general_feel: e.target.value
                                                                    })}
                                                                    className="text-sm bg-white w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    placeholder="Overall atmosphere and emotional impact"
                                                                    rows={3}
                                                                />
                                                            </Field>
                                                        </div>
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
                                    onClick={() => setIsCreateLocationOpen(false)}
                                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveLocation}
                                    className="py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all transform hover:scale-[1.02]"
                                >
                                    Save Location
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default CreateLocationDialog;
