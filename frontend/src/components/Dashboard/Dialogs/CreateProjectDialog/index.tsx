import {Button, Dialog, DialogPanel, Field, Fieldset, Input, Label, Legend, Textarea} from "@headlessui/react";
import {useState} from "react";
import {Project} from "../../../../models/project";
import {CreateProject} from "../../../../axios/Project.ts";
import {useNavigate} from "react-router";
import {FiXCircle} from "react-icons/fi";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";


const CreateProjectDialog = ({isCreateProjectOpen, setIsCreateProjectOpen}: {
    isCreateProjectOpen: boolean,
    setIsCreateProjectOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    // States
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageToSend, setImageToSend] = useState<File | null>(null)
    const [imageToShow, setImageToShow] = useState<string>('')


    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const navigate = useNavigate();

    // Hooks for state management
    const addProject = useProjectsStore((state) => state.addProject);

    // Functions
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

    const saveProject = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (imageToSend) {
            formData.append("image", imageToSend);
        }

        try {
            const response = await CreateProject(accessToken, formData)
            const newProject = Project.from(response.data)
            // dispatch(addMovieProject(
            //     newProject.toJSON()
            // ))
            addProject(newProject.toJSON())
            setIsCreateProjectOpen(false)
            return navigate(`/dashboard/project/` + response.data.id.toString());


        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Dialog open={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)} transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel transition>
                    <Fieldset className="space-y-8 bg-linear-to-t from-sky-400 to-indigo-400 p-1 rounded-xl shadow-2xl">
                        <div className="space-y-8 bg-linear-to-t from-zinc-100 to-zinc-300 p-10 rounded-lg shadow-2xl">
                            <div className="mt-1 flex items-center">
                                {imageToSend ? (
                                    <div
                                        className="relative w-32 h-32 overflow-hidden rounded-md border-2 border-indigo-200 shadow-sm">
                                        <img src={imageToShow} alt={imageToSend.name}
                                             className="object-cover w-full h-full"/>
                                        <button
                                            onClick={() => {
                                                setImageToShow('')
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
                                        <label className="cursor-pointer text-center p-2">
                                            <span className="block text-sm text-indigo-600">Upload Image</span>
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
                            <Legend className="text-lg font-bold ">Create new project</Legend>
                            <Field>
                                <Label className="block">Project name</Label>
                                <Input
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-3 w-80 xl:w-100 resize-none rounded-lg border-none bg-white py-1.5 px-3 text-sm/6 text-zinc-700 focus:outline-none"
                                    name="title"/>
                            </Field>
                            <Field>
                                <Label className="block">Project description</Label>
                                <Textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={'mt-3 block w-full resize-none rounded-lg border-none bg-white py-1.5 px-3 text-sm/6 text-zinc-700 focus:outline-none'}
                                    rows={3}
                                />
                            </Field>
                            <div className={"w-full flex justify-end text-center"}>
                                <Button
                                    onClick={() => {
                                        saveProject()
                                    }}
                                    className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                >
                                    Save project
                                </Button>
                            </div>
                        </div>
                    </Fieldset>
                </DialogPanel>
            </div>
        </Dialog>
    )

}

export default CreateProjectDialog