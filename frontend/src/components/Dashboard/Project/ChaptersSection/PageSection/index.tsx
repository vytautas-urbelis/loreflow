import {ChapterInterface, EmptyPage, PageInterface} from "../../../../../models/chapter";
import PageScenesSection from "./PageScenesSection";
import PageEditorSection from "./PageEditorSection";
import {UseListStateHandlers} from "@mantine/hooks";
import {RxDragHandleDots1} from "react-icons/rx";
import {CreatePage, DeletePage} from "../../../../../axios/Page.ts";
import {useState} from "react";
import useProjectsStore from "../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../zustand/AuthStore.tsx";

const PageSection = ({chapter, page, index, handlers, pagesState, isDragging, setDragging, draggableProps}: {
    chapter: ChapterInterface,
    page: PageInterface,
    index: number,
    handlers: UseListStateHandlers<PageInterface>,
    pagesState: PageInterface[],
    isDragging: boolean,
    setDragging: (dragging: boolean) => void,
    draggableProps: any
}) => {

    // States
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateChapterInProject = useProjectsStore((state) => state.updateChapterInProject)

    // Content references

    // Functions
    // Delete page from chapter
    const deletePage = async () => {
        try {
            // First filter out the current page from Copied Chapter
            const updatedChapter = {
                ...chapter,
                pages: chapter.pages.filter(p => p.id.toString() !== page.id.toString()),
            };

            // Update local state
            updateChapterInProject(chapter.project, updatedChapter)

            // Update Draggable list
            const pageIndex = pagesState.findIndex(p => p.id === page.id)
            handlers.remove(pageIndex)

            // Update sequence for each page based on its index
            handlers.apply((page, index) => ({
                ...page,
                sequence: (index ? index : 0) + 1  // or any other sequence logic you need
            }));

            // Delete page from database
            await DeletePage(accessToken, page.id);
        } catch (e) {
            console.error(e);
        }
    }

    // Add new page to the chapter
    const addPage = async () => {
        try {
            // Create empty page object with and update in database
            const emptyPage = {...EmptyPage(page.sequence), chapter: chapter.id};
            const res = await CreatePage(accessToken, emptyPage);

            // Update Draggable list
            handlers.insert(res.data.sequence - 1, res.data);

            // Update sequence for each page based on its index
            handlers.apply((page, index) => ({
                ...page,
                sequence: (index ? index : 0) + 1  // or any other sequence logic you need
            }));

            // Update chapter object with new page and new sequences
            const updatedChapter = {
                ...chapter,
                pages: [
                    ...chapter.pages.slice(0, page.sequence), // Take pages before the target index
                    res.data,                              // Insert the new page at the target index
                    ...chapter.pages.slice(page.sequence)    // Take pages after the target index
                ].map((page, index) => ({
                    ...page,
                    sequence: index + 1 // Apply sequence logic based on index
                }))
            };

            // Update local state
            updateChapterInProject(chapter.project, updatedChapter)
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div
            className={` grid grid-cols-1 items-center justify-center w-full `}>

            <div
                className={` ${isDragging && "rounded-md bg-white p-4"} transition-discrete duration-300 w-full  h-fit flex flex-col gap-  `}
            >
                <div className={"flex w-full justify-between items-center py-2 px-2"}>
                    <div onMouseDown={() => setDragging(true)}
                         onMouseUp={() => setDragging(false)}
                         className={"flex w-full items-center "}  {...draggableProps}>
                        <RxDragHandleDots1/>
                        <p className={"text-xs font-semibold text-zinc-500 uppercase"}>Page {page.sequence} - <span
                            className={"text-xs font-normal text-zinc-400 uppercase"}>Chapter {chapter.name}</span></p>
                    </div>
                    {!isDragging && <>
                        {isDeleting ?
                            <div className={"flex justify-end w-full gap-1"}>
                                <div onClick={() => {
                                    deletePage()
                                }}
                                     className={"text-xs px-2 py-1 bg-white border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                                    Delete page and it's content
                                </div>
                                <div onClick={() => {
                                    setIsDeleting(false)
                                }}
                                     className={"text-xs px-2 py-1 bg-white border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                                    Cancel
                                </div>
                            </div> :
                            <div className={"flex justify-end w-full"}>
                                <div onClick={() => {
                                    setIsDeleting(true)
                                }}
                                     className={"text-xs px-2 py-1 bg-white border border-zinc-200 rounded-md w-fit hover:border-zinc-400 cursor-pointer"}>
                                    Delete page
                                </div>
                            </div>
                        }</>}

                </div>


                <div
                    className={`w-full grid grid-cols-1 2xl:grid-cols-20 gap-8 transition-all duration-[200ms] ease-in-out 
                    ${isDragging
                        ? "opacity-0 max-h-0 overflow-hidden"
                        : "opacity-100 max-h-[20000px]"
                    }
                    `}>


                    <PageScenesSection chapter={chapter} page={page}/>
                    <PageEditorSection key={page.id} chapter={chapter} page={page} index={index} handlers={handlers}
                                       pagesState={pagesState} addPage={addPage}/>


                </div>
            </div>


        </div>
    )
}

export default PageSection