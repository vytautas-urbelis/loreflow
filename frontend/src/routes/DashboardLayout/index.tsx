import {Outlet, useNavigate} from "react-router"
import {useEffect} from "react";
import {GetListOfProjects} from "../../axios/Project.ts";
import useProjectsStore from "../../zustand/ProjectStore.tsx";
import useAuthStore from "../../zustand/AuthStore.tsx";
import SettingsSection from "../../components/Dashboard/Project/SettingsSection";
import {GetMyData, RefreshToken, VerifyToken} from "../../axios/Auth.ts";

const DashboardLayout = () => {

    // hooks
    // const accessToken = useAuthStore((state) => state.authData.accessToken);


    // Hooks for local state management
    const saveProjectsToStore = useProjectsStore((state) => state.saveProjectsList); // Call Zustand hook here

    // Hooks
    const navigate = useNavigate();

    // Hooks for store management
    const saveAccessToken = useAuthStore((state) => state.saveAccessToken);
    const saveAuthData = useAuthStore((state) => state.saveAuthData)
    const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
    const saveSelectedModel = useAuthStore((state) => state.saveSelectedModel);

    useEffect(() => {
        const loginWithAccess = async (accessToken: string) => {
            try {
                await VerifyToken({token: accessToken})
                const userData = await GetMyData(accessToken)
                saveAccessToken(accessToken)
                saveAuthData(userData.data)
                saveSelectedModel(userData.data.selected_model)
                setLoggedIn(true)
                await fetchProjectsList(accessToken)
                navigate('dashboard')

            } catch (e) {
                try {
                    const access = await RefreshToken({refresh: localStorage.getItem('refreshToken')})
                    localStorage.setItem('accessToken', access.data.access);
                    const userData = await GetMyData(accessToken)
                    saveAccessToken(accessToken)
                    saveAuthData(userData.data)
                    saveSelectedModel(userData.data.selected_model)
                    setLoggedIn(true)
                    await fetchProjectsList(accessToken)
                    navigate('dashboard')
                } catch (e) {
                    console.error(e)
                }
            }
        }

        const fetchProjectsList = async (accessToken: string) => {
            try {
                const response = await GetListOfProjects(accessToken)
                saveProjectsToStore(response.data)
            } catch (e) {
                console.log(e)
            }
        }

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            loginWithAccess(accessToken)
        }
    }, [])

    // useEffect(() => {
    //     const fetchProjectsList = async () => {
    //         try {
    //             const response = await GetListOfProjects(accessToken)
    //             saveProjectsToStore(response.data)
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    //
    //     fetchProjectsList();
    // }, [])

    return (
        <>
            <div
                className="flex w-full h-fit min-h-screen absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]">
                <SettingsSection/>
                <Outlet/>
            </div>
        </>
    )
}

export default DashboardLayout
