import Router from "./routes"
import "./app.css"
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import {MantineProvider} from '@mantine/core';


function App() {

    // // Hooks
    // // const navigate = useNavigate();
    //
    // // Hooks for store management
    // const saveAccessToken = useAuthStore((state) => state.saveAccessToken);
    // const saveAuthData = useAuthStore((state) => state.saveAuthData)
    // const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
    //
    // useEffect(() => {
    //     const loginWithAccess = async (accessToken: string) => {
    //         try {
    //             await VerifyToken({access: accessToken})
    //             const userData = await GetMyData(accessToken)
    //             saveAccessToken(accessToken)
    //             saveAuthData(userData.data)
    //             setLoggedIn(true)
    //             // navigate('dashboard')
    //
    //         } catch (e) {
    //             try {
    //                 const access = await RefreshToken({refresh: localStorage.getItem('refreshToken')})
    //                 localStorage.setItem('accessToken', access.data.access);
    //                 const userData = await GetMyData(accessToken)
    //                 saveAccessToken(accessToken)
    //                 saveAuthData(userData.data)
    //                 setLoggedIn(true)
    //                 // navigate('dashboard')
    //             } catch (e) {
    //                 console.error(e)
    //             }
    //         }
    //     }
    //     const accessToken = localStorage.getItem('accessToken');
    //     console.log(accessToken);
    //     if (accessToken) {
    //         loginWithAccess(accessToken)
    //     }
    // }, [])


    // useEffect(() => {
    //     const getUserData = async () => {
    //         try {
    //             const res = await GetMyData(accessToken)
    //             const id = res.data.id;
    //             const email = res.data.email;
    //             const username = res.data.username;
    //             const ws_chanel_code = res.data.ws_chanel_code;
    //             const open_router_api_key = res.data.open_router_api_key
    //             const selected_model = res.data.selected_model;
    //             saveAuthData({id, email, username, ws_chanel_code, open_router_api_key})
    //             saveSelectedModel(selected_model)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }
    //     getUserData()
    // },)

    return (
        <MantineProvider>
            <Router/>
        </MantineProvider>
    )
}

export default App
