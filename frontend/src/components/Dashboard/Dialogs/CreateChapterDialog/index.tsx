import {Button, Dialog, DialogPanel, Field, Fieldset, Input, Label, Textarea} from "@headlessui/react";
import {useState} from "react";
import {ProjectInterface} from "../../../../models/project";
import {ChapterInterface, EmptyChapter} from "../../../../models/chapter";
import {CreateChapter, DeleteChapter, UpdateChapter} from "../../../../axios/Chapter.ts";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";

const CreateChapterDialog = ({isCreateChapterOpen, setIsCreateChapterOpen, project, chapter = EmptyChapter()}: {
    isCreateChapterOpen: boolean,
    setIsCreateChapterOpen: React.Dispatch<React.SetStateAction<boolean>>,
    project: ProjectInterface,
    chapter: ChapterInterface
}) => {

    // States
    const [name, setName] = useState<string>(chapter.name);
    const [description, setDescription] = useState<string>(chapter.description);
    const [isDeleting, setIsDeleting] = useState(false);

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const deleteChapterFromProject = useProjectsStore((state) => state.deleteChapterFromProject)
    const addChapterToProject = useProjectsStore((state) => state.addChapterToProject)
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)


    const saveNewChapter = async (newChapter: ChapterInterface) => {
        try {
            // Updating project in backend
            const res = await CreateChapter(accessToken, newChapter)

            // Update local storage
            addChapterToProject(project.id, res.data)

            // Closing dialog
            setIsCreateChapterOpen(false)

        } catch (e) {
            console.log(e)
        }
    }

    const updateChapter = async (newChapter: ChapterInterface) => {
        try {
            // Updating project in backend
            const res = await UpdateChapter(accessToken, newChapter, chapter.id)

            // Update local storage
            updateChapterInProject(project.id, res.data)

            // Closing dialog
            setIsCreateChapterOpen(false)

        } catch (e) {
            console.log(e)
        }
    }

    const handleSave = async () => {
        // Creating chapter object
        const newChapter: ChapterInterface = {
            id: chapter.id,
            project: project.id,
            name: name,
            description: description,
            pages: [],
            scenes: []
        }
        try {
            if (chapter.id === '') {
                await saveNewChapter(newChapter)
            } else {
                await updateChapter(newChapter)
            }
        } catch (e) {
            console.log(e)
        }
    }


    const deleteChapter = async () => {
        try {
            await DeleteChapter(accessToken, chapter.id);
            const projectId = project?.id ? project?.id : "";
            deleteChapterFromProject(projectId, chapter)
            setIsDeleting(false);
            setIsCreateChapterOpen(false)
        } catch (e) {
            console.log(e)
        }
    }
    return (
        // <Dialog
        //     open={isCreateCharacterOpen}
        //     onClose={() => setIsCreateCharacterOpen(false)}
        //     transition
        //     className="z-50 fixed inset-0 flex w-screen items-center justify-center bg-black/30 transition duration-300 ease-out data-[closed]:opacity-0"
        // >
        //     <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
        //         <DialogPanel transition className="w-fit max-w-3xl">
        //             <div className="shadow-2xl">
        //                 <div className="bg-white rounded-sm border border-zinc-300 shadow-inner overflow-hidden w-fit">
        //                     <div
        //                         className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
        //                         <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
        //                             {chapter.name ? `Chapter: ${chapter.name}` : 'Create new chapter'}
        //                         </h2>
        //                     </div>
        <Dialog open={isCreateChapterOpen}
                onClose={() => setIsCreateChapterOpen(false)} transition
                className="z-50 fixed inset-0 flex w-screen items-center justify-center bg-black/30 transition duration-300 ease-out data-[closed]:opacity-0">
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition className="w-fit max-w-lg">
                    <Fieldset className="bg-white rounded-sm border border-zinc-300 shadow-inner overflow-hidden w-fit">
                        <div className=" bg-white rounded-lg shadow-2xl">
                            {isDeleting ?
                                <div className={""}>
                                    <div
                                        className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                            {chapter.name ? `Chapter: ${chapter.name}` : 'Create new chapter'}
                                        </h2>
                                    </div>
                                    <div className={"p-6"}>
                                        <p className={"text-center text-wrap mb-10"}>Do you really want to delete this
                                            chapter?
                                            All
                                            content within this chapter
                                            will be deleted too!</p>
                                        <div className={"flex justify-between"}>

                                            <div className={"w-full flex text-center"}>
                                                <Button
                                                    onClick={() => {
                                                        deleteChapter()
                                                    }}
                                                    className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                                >
                                                    Delete chapter
                                                </Button>
                                            </div>
                                            <div className={"w-full flex justify-end text-center"}>
                                                <Button
                                                    onClick={() => {
                                                        setIsDeleting(false)
                                                    }}
                                                    className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                : <>
                                    <div
                                        className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                                        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                                            {chapter.name ? `Chapter: ${chapter.name}` : 'Create new chapter'}
                                        </h2>
                                    </div>
                                    <div className={"p-6"}>
                                        <Field>
                                            <Label className="block mt-3">Chapter name</Label>
                                            <Input
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                                className="mt-1 w-80 xl:w-100 resize-none rounded-lg border border-zinc-300 bg-white py-1.5 px-3 text-sm/6 text-zinc-700 focus:outline-none"
                                                name="title"/>
                                        </Field>
                                        <Field>
                                            <Label className="block mt-3">Chapter description</Label>
                                            <Textarea
                                                onChange={(e) => setDescription(e.target.value)}
                                                value={description}
                                                className={'mt-1 block w-full resize-none rounded-lg border border-zinc-300 bg-white py-1.5 px-3 text-sm/6 text-zinc-700 focus:outline-none'}
                                                rows={4}
                                            />
                                        </Field>
                                        <div className={"flex mt-6"}>
                                            {chapter.id &&
                                                <div className={"w-full flex  text-center"}>
                                                    <Button
                                                        onClick={() => {
                                                            setIsDeleting(true)
                                                        }}
                                                        className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                                    >
                                                        Delete chapter
                                                    </Button>
                                                </div>}
                                            <div className={"w-full flex justify-end text-center"}>
                                                <Button
                                                    onClick={() => {
                                                        handleSave()
                                                    }}
                                                    className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                                >
                                                    Save chapter
                                                </Button>
                                            </div>

                                        </div>
                                    </div>

                                </>}


                        </div>
                    </Fieldset>
                </DialogPanel>
            </div>
        </Dialog>
    )

}

export default CreateChapterDialog