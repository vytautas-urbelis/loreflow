import {Button, Dialog, DialogPanel, Field, Fieldset, Label, Textarea} from "@headlessui/react";
import {useState} from "react";
import {CreateProject} from "../../../../axios/Project.ts";
import {useNavigate} from "react-router";
import {GrSend} from "react-icons/gr";
import useAuthStore from "../../../../zustand/AuthStore.tsx";


const GenerateCharacterDialog = ({isGenerateCharacterOpen, setIsGenerateCharacterOpen}: {
    isGenerateCharacterOpen: boolean,
    setIsGenerateCharacterOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [title,] = useState("")
    const [description, setDescription] = useState("")


    const accessToken = useAuthStore((state) => state.authData.accessToken);
    // const dispatch = useAppDispatch()

    const navigate = useNavigate();


    const saveProject = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        try {
            const response = await CreateProject(accessToken, formData)
            // const newProject = Project.from(response.data)
            // dispatch(addMovieProject(
            //     newProject.toJSON()
            // ))
            setIsGenerateCharacterOpen(false)
            return navigate(`/dashboard/project/` + response.data.id.toString());


        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Dialog open={isGenerateCharacterOpen}
                onClose={() => setIsGenerateCharacterOpen(false)} transition
                className="fixed inset-0 flex w-screen items-center justify-end bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0">
            <div className="fixed inset-0 flex w-screen items-end justify-center p-4">
                <DialogPanel transition>
                    <Fieldset>
                        <div className="relative">
                            <Field className={"relative bg-linear-to-t from-sky-400 to-indigo-400 p-1 rounded-xl"}>

                                <div className=" block w-160 rounded-lg border-none bg-white">
                                    <Textarea
                                        onChange={(e) => setDescription(e.target.value)}
                                        className={' block w-160 resize-none rounded-lg border-none bg-white py-1.5 px-3 text-base/6 text-zinc-700 focus:outline-none'}
                                        rows={3}
                                    />
                                    <Label className="block pl-2 pb-1 text-sm text-zinc-500">Write some instructions to
                                        generate character - optional</Label>
                                </div>

                            </Field>
                            <div className={"w-full flex justify-end text-center absolute bottom-3 right-3"}>
                                <Button
                                    onClick={() => {
                                        saveProject()
                                    }}
                                    className="rounded-full bg-zinc-700/60 p-2 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                >
                                    <GrSend/>
                                </Button>
                            </div>
                        </div>
                    </Fieldset>
                </DialogPanel>
            </div>
        </Dialog>
    )

}

export default GenerateCharacterDialog