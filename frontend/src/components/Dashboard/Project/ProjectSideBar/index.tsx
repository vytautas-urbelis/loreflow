// import DashboardHeader from "./Header/index";
import {ProjectInterface} from "../../../../models/project";
import {SetStateAction, useEffect, useState} from "react";
import {MdOutlineAdd} from "react-icons/md";
import CreateCharacterDialog from "../../Dialogs/CreateCharacterDialog/index.tsx";
import {EmptyCharacter} from "../../../../models/character/character.ts";
import {SaveBook} from "../../../../axios/Book.ts";
import {BookInterface} from "../../../../models/book/book.ts";
import GenerateCharacterDialog from "../../Dialogs/GenerateCharacterDialog";
import CreateItemDialog from "../../Dialogs/CreateItemDialog";
import {EmptyItem} from "../../../../models/item/item.tsx";
import CreateChapterDialog from "../../Dialogs/CreateChapterDialog";
import CreateLocationDialog from "../../Dialogs/CreateLocationDialog";
import {EmptyLocation} from "../../../../models/location/location";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import {EmptyChapter} from "../../../../models/chapter";
import useAuthStore from "../../../../zustand/AuthStore.tsx";


const ProjectSideBar = ({project}: {
    project: ProjectInterface,
    setIsExtracting: React.Dispatch<SetStateAction<boolean>>,
    isExtracting: boolean
}) => {

    // states management
    const [isCreateCharacterOpen, setIsCreateCharacterOpen] = useState(false)
    const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false)
    const [isCreateItemOpen, setIsCreateItemOpen] = useState(false)
    const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false)
    const [isGenerateCharacterOpen, setIsGenerateCharacterOpen] = useState(false)
    // const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
    const [isBookSaving, setIsBookSaving] = useState<File | null>(null)


    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList)

    // variables
    const emptyCharacter = EmptyCharacter()

    // useEffects
    useEffect(() => {
        if (isBookSaving) {
            saveBook(isBookSaving)
            setIsBookSaving(null)
        }

    }, [isBookSaving])

    const saveBook = async (book: File) => {
        const formData = new FormData();
        formData.append("file", book);
        formData.append("name", book.name);
        formData.append("size", JSON.stringify(book.size));
        formData.append("project_id", project.id)
        try {
            const res = await SaveBook(accessToken, formData)
            const newBook: BookInterface[] = [res.data]
            project = {...project, book: newBook}
            // dispatch(updateProjectInList(project))
            updateProjectInList(project)
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <section
            className={"flex shrink-0 flex-row w-22 duration-300 fixed right-0 top-16 bottom-0"}>
            <div className={"flex shrink-0 flex-col items-center pt-3 px-2 gap-3"}>
                {/*Chapter Section*/}
                <CreateChapterDialog chapter={EmptyChapter()} isCreateChapterOpen={isCreateChapterOpen}
                                     setIsCreateChapterOpen={setIsCreateChapterOpen} project={project}/>
                {/*<div className={"flex shrink-0 flex-col items-center pt-3 gap-3"}>*/}
                <p className={"text-[11px] text-zinc-700 font-semibold uppercase"}>Chapter</p>
                <div onClick={() => setIsCreateChapterOpen(true)}
                     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +
                         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>
                    <span className={"text-zinc-800 text-xl"}><MdOutlineAdd/></span>
                </div>
                {/*</div>*/}

                {/*Character Section*/}
                <CreateCharacterDialog isCreateCharacterOpen={isCreateCharacterOpen}
                                       setIsCreateCharacterOpen={setIsCreateCharacterOpen}
                                       character={emptyCharacter} project={project}/>

                <p className={"text-[11px] text-zinc-700 font-semibold uppercase"}>Character</p>
                <div onClick={() => setIsCreateCharacterOpen(true)}
                     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +
                         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>
                    <span className={"text-zinc-800 text-xl"}><MdOutlineAdd/></span>
                </div>

                <GenerateCharacterDialog isGenerateCharacterOpen={isGenerateCharacterOpen}
                                         setIsGenerateCharacterOpen={setIsGenerateCharacterOpen}
                    // character={emptyCharacter} project={project}
                />
                {/*<div onClick={() => setIsGenerateCharacterOpen(true)}*/}
                {/*     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +*/}
                {/*         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>*/}
                {/*    <span className={"text-indigo-600 text-lg"}><PiMagicWand/></span>*/}
                {/*</div>*/}


                {/*{project.book[0] ?*/}
                {/*    <div onClick={() => extractCharacters()}*/}
                {/*         className={"flex items-center justify-center opacity-70 hover:opacity-100"}>*/}
                {/*        <div>*/}
                {/*            <div*/}
                {/*                className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +*/}
                {/*                    "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>*/}
                {/*                {isExtracting && <>*/}
                {/*                <span*/}
                {/*                    className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-sky-400 opacity-75 right-0 top-0"></span>*/}
                {/*                    <span*/}
                {/*                        className="absolute inline-flex size-3 rounded-full bg-sky-500 right-0 top-0"></span>*/}
                {/*                </>}*/}
                {/*                <span*/}
                {/*                    className={"text-zinc-800 text-lg"}>*/}
                {/*                        <FaRegFilePdf/>*/}
                {/*                </span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div> :*/}
                {/*    <div*/}
                {/*        className={"flex items-center justify-center opacity-40"}>*/}
                {/*        <div>*/}
                {/*            <div*/}
                {/*                className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +*/}
                {/*                    "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>*/}
                {/*                {isExtracting && <>*/}
                {/*                <span*/}
                {/*                    className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-sky-400 opacity-40 right-0 top-0"></span>*/}
                {/*                    <span*/}
                {/*                        className="absolute inline-flex size-3 rounded-full bg-sky-500 right-0 top-0"></span>*/}
                {/*                </>}*/}
                {/*                <span*/}
                {/*                    className={"text-lg p-5  rounded-2xl opacity-40"}>*/}
                {/*                        <FaRegFilePdf/></span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>}*/}
                {/*Item Section*/}
                <CreateItemDialog isCreateItemOpen={isCreateItemOpen}
                                  setIsCreateItemOpen={setIsCreateItemOpen} project={project} item={EmptyItem()}/>
                {/*<div className={"flex shrink-0 flex-col items-center pt-3 gap-3"}>*/}
                <p className={"text-[11px] text-zinc-700 font-semibold uppercase"}>Item</p>
                <div onClick={() => setIsCreateItemOpen(true)}
                     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +
                         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>
                    <span className={"text-zinc-800 text-xl"}><MdOutlineAdd/></span>
                </div>
                {/*<div onClick={() => setIsGenerateCharacterOpen(true)}*/}
                {/*     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +*/}
                {/*         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>*/}
                {/*    <span className={"text-indigo-600 text-lg"}><PiMagicWand/></span>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*Location Section*/}
                <CreateLocationDialog isCreateLocationOpen={isCreateLocationOpen}
                                      setIsCreateLocationOpen={setIsCreateLocationOpen} project={project}
                                      location={EmptyLocation()}/>
                {/*<div className={"flex shrink-0 flex-col items-center pt-3 gap-3"}>*/}
                <p className={"text-[11px] text-zinc-700 font-semibold uppercase"}>Location</p>
                <div onClick={() => setIsCreateLocationOpen(true)}
                     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +
                         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>
                    <span className={"text-zinc-800 text-xl"}><MdOutlineAdd/></span>
                </div>
                {/*<div onClick={() => setIsGenerateCharacterOpen(true)}*/}
                {/*     className={"h-8 w-8 bg-zinc-50 rounded-lg flex flex-col justify-center " +*/}
                {/*         "items-center border-zinc-200 border border cursor-pointer hover:bg-white"}>*/}
                {/*    <span className={"text-indigo-600 text-lg"}><PiMagicWand/></span>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*<AddBookDialog isBookDialogOpen={isBookDialogOpen} setIsBookDialogOpen={setIsBookDialogOpen}*/}
                {/*               project={project}/>*/}

                {/*<div onClick={() => setIsBookDialogOpen(true)}>*/}
                {/*    {project.book[0] ?*/}

                {/*        <div*/}
                {/*            className={"flex items-center justify-center w-8 cursor-pointer bottom-4"}>*/}
                {/*            <div className={"flex flex-col items-center justify-center w-full"}>*/}
                {/*                <div*/}
                {/*                    className={"relative w-8 h-8 bg-zinc-50 rounded-lg flex flex-col justify-center items-center  border-zinc-200  border"}>*/}
                {/*                    <div*/}
                {/*                        className={"flex text-xl text-zinc-800 hover:text-zinc-700 rounded-2xl "}>*/}
                {/*                        <FaRegFilePdf/>*/}
                {/*                    </div>*/}
                {/*                    <div className={"absolute bottom-0 right-0 text-xs text-green-600"}><FaCheckCircle/>*/}
                {/*                    </div>*/}

                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        :*/}
                {/*        <div*/}
                {/*            className={"flex items-center justify-center w-13 bottom-4"}>*/}
                {/*            <div className={"flex flex-col items-center justify-center w-full"}>*/}

                {/*                <div*/}
                {/*                    className={"w-8 h-8 bg-zinc-50 rounded-lg flex flex-col justify-center items-center  border-zinc-200 border-dashed border-2 cursor-pointer "}>*/}
                {/*                    <div*/}
                {/*                        className={"flex text-xl text-zinc-300 hover:text-zinc-700 rounded-2xl "}>*/}
                {/*                        <FaRegFilePdf/>*/}
                {/*                    </div>*/}

                {/*                </div>*/}
                {/*                <p className={"text-[9px] text-zinc-700 font-semibold uppercase w-full mt-1 "}>Add*/}
                {/*                    book</p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        </section>


    )
}
export default ProjectSideBar
