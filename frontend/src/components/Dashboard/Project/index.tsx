// import DashboardHeader from "./Header/index";
import {ProjectInterface} from "../../../models/project";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {GetProject} from "../../../axios/Project.ts";
import ProjectSideBar from "./ProjectSideBar";
import ChapterSection from "./ChaptersSection";
import ProjectDataSideBar from "./ProjectDataSideBar";
import useProjectsStore from "../../../zustand/ProjectStore.tsx";
import ChatComponent from "../Chat";
import useChatStore from "../../../zustand/Chat.ts";

const ProjectIndex = () => {

    // states management
    const [isExtracting, setIsExtracting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab,] = useState('Chapters')
    const [isFocused, setIsFocused] = useState(false);


    // Hooks
    const {id} = useParams();
    // const accessToken = useAuthStore((state) => state.authData.accessToken);
    const project: ProjectInterface | undefined = useProjectsStore((state) => state.projectsList.find(item => item.id.toString() === id?.toString()))

    // LocalStorage update Hooks
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList)
    const setChat = useChatStore((state) => state.setChat);

    // UseEffect to fetch project from database
    useEffect(() => {
        setIsLoading(true)
        const fetchProject = async () => {
            try {
                // Calling backend API for project
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    const response = await GetProject(accessToken, id);

                    // Setting chat data
                    setChat(response.data.chat);

                    // Updating local state with fetched project
                    updateProjectInList(response.data);
                } else {
                    return
                }

            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false)
            }
        }

        if (id && project && id === project.id) {
            setIsLoading(false)
            //fetch project from server and update
            fetchProject()
        } else {
            fetchProject()
        }

    }, [id])


    return (
        <section className={" w-full flex flex-col justify-start items-start min-h-screen"}>
            <section className={"w-full shrink-0 h-16 p-3 gap-3  lg:block"}>
            </section>
            <div className={"flex w-full h-full "}>
                <ProjectDataSideBar project={project} isExtracting={isExtracting}/>
                <section className={"w-18 shrink-0 h-full p-3 gap-3 lg:block"}>
                </section>

                {/*Loading projects from server*/}
                {isLoading ?
                    <div
                        className=" flex flex-col justify-between items-center w-full  p-3 ">
                        <div className={"text-2xl text-zinc-400"}></div>
                    </div> :

                    <>

                        {/*Checking if project already loaded*/}
                        {project ?

                            <div className={"flex flex-col w-full "}>
                                {/*Api settings Section*/}
                                {/*<SettingsSection/>*/}

                                {/*<div className={"flex gap-4 w-full p-2 mt-2"}>*/}
                                {/*    <p onClick={() => {*/}
                                {/*        setActiveTab('Chapters')*/}
                                {/*    }}*/}
                                {/*       className={`text-xs text-zinc-700 hover:underline cursor-pointer ${activeTab === 'Chapters' ? "font-bold " : ""}`}>CHAPTERS</p>*/}
                                {/*    <p onClick={() => {*/}
                                {/*        setActiveTab('Scenes')*/}
                                {/*    }}*/}
                                {/*       className={`text-xs text-zinc-700 hover:underline cursor-pointer ${activeTab === 'Scenes' ? "font-bold " : ""}`}>SCENES</p>*/}
                                {/*    <p onClick={() => {*/}
                                {/*        setActiveTab('Characters')*/}
                                {/*    }}*/}
                                {/*       className={`text-xs text-zinc-700 hover:underline cursor-pointer ${activeTab === 'Characters' ? "font-bold " : ""}`}>CHARACTERS</p>*/}
                                {/*    <p onClick={() => {*/}
                                {/*        setActiveTab('Items')*/}
                                {/*    }}*/}
                                {/*       className={`text-xs text-zinc-700 hover:underline cursor-pointer ${activeTab === 'Items' ? "font-bold " : ""}`}>ITEMS</p>*/}
                                {/*    <p onClick={() => {*/}
                                {/*        setActiveTab('Locations')*/}
                                {/*    }}*/}
                                {/*       className={`text-xs text-zinc-700 hover:underline cursor-pointer ${activeTab === 'Locations' ? "font-bold " : ""}`}>LOCATIONS</p>*/}
                                {/*</div>*/}

                                {/*Chapters Section*/}
                                {project.chapters && activeTab === 'Chapters' &&
                                    <div
                                        className="w-full items-start justify-start flex flex-col pt-3 gap-2">
                                        {project.chapters.map((chapter) => (
                                            <ChapterSection key={chapter.id} chapter={chapter} project={project}/>
                                        ))}

                                    </div>}

                                {/*Chat Section*/}
                                <div className={"w-full h-60"}></div>
                            </div>

                            :
                            <div className={"w-full"}></div>
                        }</>
                }


                <section
                    className={"flex shrink-0 flex-col w-23 min-h-[600px] p-3 gap-3"}>
                </section>
                {project &&
                    <>
                        <ProjectSideBar project={project} setIsExtracting={setIsExtracting}
                                        isExtracting={isExtracting}/>
                        <div className={"fixed bottom-6 left-[50%] translate-x-[-50%] "}><ChatComponent
                            setIsFocused={setIsFocused} isFocused={isFocused} projectId={project.id}/></div>
                        {/*{isFocused && <div className={"fixed top-0 left-0 right-0 bottom-0 bg-white/40"}></div>}*/}
                    </>
                }


            </div>

        </section>

    )
}
export default ProjectIndex
