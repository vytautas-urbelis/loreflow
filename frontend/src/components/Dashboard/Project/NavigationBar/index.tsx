import {FaRegSquarePlus} from "react-icons/fa6";
import {ProjectInterface} from "../../../../models/project";
import CreateProjectDialog from "../../Dialogs/CreateProjectDialog";
import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import ProjectTab from "./ProjectTab";
import UserProfileDialog from "../../Dialogs/UserProfileDialog";
import useProjectsStore from "../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../zustand/AuthStore.tsx";
import {TbLogout2} from "react-icons/tb";


const NavBar = () => {
    // State management
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)

    // hooks
    const {id} = useParams();
    const navigate = useNavigate();
    const projectsList = useProjectsStore((state) => state.projectsList);
    const userData = useAuthStore((state) => state.authData);
    // const ref = useClickOutside(() => closeSideBar());

    // Hooks for store management
    const saveAuthData = useAuthStore((state) => state.saveAuthData);
    const setIsLoggedIn = useAuthStore((state) => state.setLoggedIn);
    const saveAccessToken = useAuthStore((state) => state.saveAccessToken);


    const selectProject = (project: ProjectInterface) => {
        if (id) {
            if (project.id.toString() !== id.toString()) {
                return navigate(`/dashboard/project/` + project.id.toString());
            }
        } else {
            return navigate(`/dashboard/project/` + project.id.toString());
        }

    }

    const logout = () => {
        saveAuthData({id: '', email: '', username: '', ws_chanel_code: '', open_router_api_key: ''})
        saveAccessToken('')
        setIsLoggedIn(false)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/')
    }


    return (<>
        <section
            className={"flex duration-300 w-70 transform bg-white flex-col flex-shrink-0 top-16 left-0 bottom-0  border-r-1 border-zinc-200 p-4 gap-3 fixed  lg:block"}>
            <div className={"flex items-center gap-2 w-full mb-5 px-2  justify-between"}>
                {/*<p className={"size-7 bg-zinc-200 rounded-md"}></p>*/}
                <p onClick={() => {
                    setIsUserProfileOpen(true)
                }} className={"text-sm font-semibold cursor-pointer"}>{userData.username}</p>
                <div onClick={() => {
                    logout()
                }} className={"text-lg"}><TbLogout2/></div>
            </div>
            <UserProfileDialog isUserProfileOpen={isUserProfileOpen} setIsUserProfileOpen={setIsUserProfileOpen}
                               userData={userData}/>

            <div onClick={() => {
                setIsCreateProjectOpen(true)
            }}
                 className="flex items-center w-full rounded-xl px-2 py-1 gap-2 cursor-default hover:bg-zinc-100 active:bg-zinc-200 mb-2">
                <div
                    className={"flex size-5 rounded-md items-center justify-center"}>
                    <div className={"text-indigo-400 text-lg"}><FaRegSquarePlus/></div>

                </div>
                <div className={"text-sm text-zinc-700"}>New project</div>
            </div>
            {projectsList.length !== 0 &&
                <>{projectsList.map((project: ProjectInterface) => (
                    <div key={project.id}

                        // onClick={() =>
                        //     selectProject(project)
                        // }
                         className={`flex items-center w-full rounded-md pl-2 justify-between gap-4 hover:bg-zinc-100 cursor-default p-1 ${id === project.id.toString() ? "bg-zinc-100" : ""}`}>
                        <ProjectTab selectProject={selectProject} project={project}/>

                    </div>
                ))}</>
            }
            <CreateProjectDialog setIsCreateProjectOpen={setIsCreateProjectOpen}
                                 isCreateProjectOpen={isCreateProjectOpen}/>
        </section>
    </>)
}

export default NavBar