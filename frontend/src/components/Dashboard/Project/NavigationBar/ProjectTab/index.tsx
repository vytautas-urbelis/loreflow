import {ProjectInterface} from "../../../../../models/project";
import {useState} from "react";
import {useNavigate} from "react-router";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {findAndDeleteProjectById} from "../../../../../models/project/movieProjectControll.ts";
import {DeleteProject} from "../../../../../axios/Project.ts";
import useProjectsStore from "../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../zustand/AuthStore.tsx";


const ProjectTab = ({selectProject, project}: {
    selectProject: (project: ProjectInterface) => void,
    project: ProjectInterface
}) => {

    // States
    const [isDeleting, setIsDeleting] = useState(false)

    // Hooks
    const projectsList = useProjectsStore((state) => state.projectsList);
    const saveProjectsList = useProjectsStore((state) => state.saveProjectsList);
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const navigate = useNavigate();


    // Functions

    // Function to delete project
    const deleteProject = async (id: number | string) => {
        try {
            await DeleteProject(accessToken, id);
            const updatedProjectList = findAndDeleteProjectById(id, projectsList)
            if (updatedProjectList) {
                saveProjectsList(updatedProjectList);
            }
            navigate(`/dashboard`);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <>
            <div onClick={() => {
                selectProject(project)
            }} className={"flex gap-2 w-full"}>
                <div className={"text-sm text-zinc-700"}>{project.title}</div>
            </div>
            <div className={`flex items-center justify-center w-10`}>
                {isDeleting ?
                    <div className={"flex justify-end w-full gap-1"}>
                        <div onClick={() => {
                            setIsDeleting(false)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60"}>
                            <FiXCircle/>
                        </div>
                        <div onClick={() => {
                            deleteProject(project.id)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60 pr-2"}>
                            <FiCheckCircle/></div>
                    </div> :
                    <div className={"flex justify-end w-full"}>
                        <div onClick={() => {
                            setIsDeleting(true)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60 pr-2"}>
                            <RiDeleteBin6Line/></div>
                    </div>
                }
            </div>
        </>
    )
}

export default ProjectTab