import {Dialog, DialogPanel, Fieldset} from "@headlessui/react";
import {useCallback, useEffect, useState} from "react";
import {ProjectInterface} from "../../../../models/project";
import {Document, Page} from "react-pdf";
import {FaRegFilePdf} from "react-icons/fa";
import {useDropzone} from "react-dropzone";
import {DeleteBook, SaveBook} from "../../../../axios/Book.ts";
import {BookInterface} from "../../../../models/book/book.ts";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {Loader} from '@mantine/core';
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";

const AddBookDialog = ({isBookDialogOpen, setIsBookDialogOpen, project}: {
    isBookDialogOpen: boolean,
    setIsBookDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    project: ProjectInterface,
}) => {

    //on file dropped

    // states management
    const [isDeleting, setIsDeleting] = useState(false)
    const [isBookSaving, setIsBookSaving] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber,] = useState<number>(1);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setIsBookSaving(acceptedFiles[0]);
    }, [])


    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    // Hooks for state management
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList);

    // useEffects
    useEffect(() => {
        if (isBookSaving) {
            saveBook(isBookSaving)
            setIsBookSaving(null)
        }

    }, [isBookSaving])


    //Functions
    const deleteBook = async () => {
        try {
            await DeleteBook(accessToken, project.book[0].id)
            project = {...project, book: []}
            updateProjectInList(project)
            setIsDeleting(false)
        } catch (e) {
            console.log(e)
        }
    }

    const saveBook = async (book: File) => {
        const formData = new FormData();
        formData.append("file", book);
        formData.append("name", book.name);
        formData.append("size", JSON.stringify(book.size));
        formData.append("project_id", project.id)
        try {
            setIsUploading(true)
            const res = await SaveBook(accessToken, formData)
            const newBook: BookInterface[] = [res.data]
            project = {...project, book: newBook}
            updateProjectInList(project)
        } catch (e) {
            console.log(e)
        } finally {
            setIsUploading(false)
        }
    }


    function onDocumentLoadSuccess({numPages}: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <Dialog open={isBookDialogOpen}
                onClose={() => setIsBookDialogOpen(false)} transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0">
            <div className="fixed inset-0 flex w-screen items-start mt-10 justify-center p-4">
                <DialogPanel transition>
                    <Fieldset className="space-y-8 bg-linear-to-t from-sky-400 to-indigo-400 p-1 rounded-xl shadow-2xl">
                        <div
                            className="space-y-8 bg-linear-to-t from-zinc-100 to-zinc-300 p-10 rounded-lg shadow-2xl ">

                            {project.book[0] ?
                                <div className={"flex items-center justify-center w-full "}>

                                    <div
                                        className={"flex flex-col gap-2 items-center justify-center min-h-60 w-100 bg-zinc-50 rounded-lg"}>


                                        {/*<div*/}
                                        {/*    className={"w-full bg-zinc-50 rounded-lg flex flex-col justify-center items-center py-3 px-3"}>*/}

                                        <div className={"flex flex-col items-center justify-center w-full"}>
                                            <Document className={"border-2 rounded-md border-zinc-200 p-1"}
                                                      file={project.book[0].file}
                                                      onLoadSuccess={onDocumentLoadSuccess}>
                                                <Page height={80} pageNumber={pageNumber}/>
                                            </Document>
                                            <p>
                                                {numPages} pages
                                            </p>
                                        </div>
                                        <div className={"flex items-center justify-center flex-wrap gap-2"}>
                                            <p className={"text-lg "}>{project.book[0].name}</p>
                                            {project.book[0] &&
                                                <>{isDeleting ?
                                                    <div className={"flex justify-end gap-1 "}>
                                                        <div onClick={() => {
                                                            setIsDeleting(false)
                                                        }}
                                                             className={"text-zinc-600 duration-300 hover:text-zinc-800 text-lg opacity-40 hover:opacity-60"}>
                                                            <FiXCircle/>
                                                        </div>
                                                        <div onClick={() => {
                                                            deleteBook()
                                                        }}
                                                             className={"text-zinc-600 duration-300 hover:text-zinc-800 text-lg opacity-40 hover:opacity-60 pr-2"}>
                                                            <FiCheckCircle/></div>
                                                    </div> :
                                                    <div className={"flex justify-end "}>
                                                        <div onClick={() => {
                                                            setIsDeleting(true)
                                                        }}
                                                             className={"text-zinc-4600 duration-300 hover:text-zinc-800 text-lg opacity-40 hover:opacity-60 pr-2"}>
                                                            <RiDeleteBin6Line/></div>
                                                    </div>
                                                }</>}
                                        </div>
                                        {/*</div>*/}
                                    </div>
                                </div>

                                :

                                <div {...getRootProps()}
                                     className={"flex items-center justify-center w-full  cursor-pointer relative"}>
                                    <input {...getInputProps()} />
                                    {!isDragActive &&
                                        <div
                                            className={"flex flex-col gap-2 items-center justify-center min-h-60 w-100 border-zinc-200 border-dashed border-4 bg-zinc-50 rounded-lg"}>
                                            <p className={"text-6xl text-zinc-500"}><FaRegFilePdf/></p>
                                            <div className={"flex items-end flex-wrap"}>
                                                <p className={"text-sm pl-2 text-zinc-500"}>Drop PDF book here.</p>
                                            </div>
                                        </div>
                                    }
                                    {isUploading &&
                                        <div
                                            className={"absolute space-0 bg-white/60 top-0 right-0 left-0 bottom-0 flex items-center justify-center"}>
                                            <Loader color="blue"/></div>}
                                </div>
                            }
                        </div>
                    </Fieldset>
                </DialogPanel>
            </div>
        </Dialog>
    )

}

export default AddBookDialog