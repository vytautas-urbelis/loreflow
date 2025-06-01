import {ProjectInterface} from "../../../../models/project";
import {useState} from "react";
import CharactersSection from "./CharactersSection";
import ItemsSection from "./ItemsSection";
import LocationsSection from "./LocationsSection";
import UserProfileDialog from "../../Dialogs/UserProfileDialog";
import {IoMdMenu} from "react-icons/io";
import {RiMenuUnfold2Fill} from "react-icons/ri";
import useAuthStore from "../../../../zustand/AuthStore.tsx";
import {TbLogout2} from "react-icons/tb";
import {useNavigate} from "react-router";


const ProjectDataSideBar = ({project, isExtracting}: {
                                project: ProjectInterface | undefined,
                                isExtracting: React.SetStateAction<boolean>
                            }
) => {
    // State management
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [showSideBarContent, setShowSideBarContent] = useState(false)

    // Hooks
    const userData = useAuthStore((state) => state.authData);
    const navigate = useNavigate()
    // const ref = useClickOutside(() => closeSideBar());

    // Hooks for store management
    const saveAuthData = useAuthStore((state) => state.saveAuthData);
    const setIsLoggedIn = useAuthStore((state) => state.setLoggedIn);
    const saveAccessToken = useAuthStore((state) => state.saveAccessToken);

    const openSideBar = () => {
        setSideBarOpen(true)
        setTimeout(() => {
            setShowSideBarContent(true)
        }, 310)
    }

    const closeSideBar = () => {
        setShowSideBarContent(false)
        setSideBarOpen(false)

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
                // ref={ref}
                className={`overflow:hidden overflow-auto flex duration-300 ${sideBarOpen ? 'w-76' : "w-12"} transform bg-white flex-col flex-shrink-0 top-16 left-0 bottom-0  border-r-1 border-zinc-200 p-3 gap-3 fixed  lg:block z-10`}>
                {!sideBarOpen &&
                    <div onClick={openSideBar} className={"w-full flex justify-center cursor-pointer"}><IoMdMenu/>
                    </div>}
                {showSideBarContent &&
                    <div>
                        <div className={"flex justify-between mb-6"}>
                            <div className={"w-10"}></div>
                            <div className={"cursor-pointer"} onClick={closeSideBar}><RiMenuUnfold2Fill/></div>
                        </div>
                        <div className={"flex items-center gap-2 w-full mb-5 px-2  justify-between"}>
                            {/*<p className={"size-7 bg-zinc-200 rounded-md"}></p>*/}
                            <p onClick={() => {
                                setIsUserProfileOpen(true)
                            }} className={"text-sm font-semibold cursor-pointer"}>{userData.username}</p>
                            <div onClick={() => {
                                logout()
                            }} className={"text-lg"}><TbLogout2/></div>
                        </div>
                        <UserProfileDialog isUserProfileOpen={isUserProfileOpen}
                                           setIsUserProfileOpen={setIsUserProfileOpen}
                                           userData={userData}/>
                        <div
                            className={"grid grid-cols-1  gap-3 w-full justify-center transition overflow-auto "}>
                            {project &&
                                <div
                                    className="w-full items-start justify-start flex ">
                                    <CharactersSection project={project} isExtracting={isExtracting}/>
                                </div>}

                            {project &&
                                <div
                                    className="w-full items-start justify-start flex ">
                                    <ItemsSection project={project} isExtracting={isExtracting}/>
                                </div>}
                            {project &&
                                <div
                                    className="w-full items-start justify-start flex ">
                                    <LocationsSection project={project} isExtracting={isExtracting}/>
                                </div>}
                        </div>
                    </div>
                }

            </section>
        </>
    )
}

export default ProjectDataSideBar