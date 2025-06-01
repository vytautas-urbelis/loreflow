import {Group} from "@mantine/core";
import {useToggle} from "@mantine/hooks";
import {useEffect, useState} from "react";
import LOGO from "../../assets/logo.png"
import {GetMyData, RefreshToken, RegisterUser, UserLogin, VerifyToken} from "../../axios/Auth.ts";
import useAuthStore from "../../zustand/AuthStore.tsx";
import {useNavigate} from "react-router";
import LoadingThreeDotsPulse from "../Dashboard/Chat/Thinking";

const Home = () => {
    // states management
    const [type, toggle] = useToggle(['login', 'register']);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    // Hooks
    // const accessToken = useAuthStore((state) => state.authData.accessToken);
    const navigate = useNavigate();

    // Hooks for store management
    const saveAccessToken = useAuthStore((state) => state.saveAccessToken);
    const saveAuthData = useAuthStore((state) => state.saveAuthData)
    const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

    useEffect(() => {
        const loginWithAccess = async (accessToken: string) => {
            try {
                await VerifyToken({token: accessToken})
                const userData = await GetMyData(accessToken)
                saveAccessToken(accessToken)
                saveAuthData(userData.data)
                setLoggedIn(true)
                navigate('dashboard')

            } catch (e) {
                try {
                    const access = await RefreshToken({refresh: localStorage.getItem('refreshToken')})
                    localStorage.setItem('accessToken', access.data.access);
                    const userData = await GetMyData(accessToken)
                    saveAccessToken(accessToken)
                    saveAuthData(userData.data)
                    setLoggedIn(true)
                    navigate('dashboard')
                } catch (e) {
                    console.error(e)
                }
            }
        }
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            loginWithAccess(accessToken)
        }
    }, [])


    useEffect(() => {
        if (password && rePassword) {
            if (password !== rePassword) {
                return setPasswordMatch(false);
            } else {
                return setPasswordMatch(true);
            }
        }
        setPasswordMatch(true)
    }, [password, rePassword]);

    const handleRegister = async () => {
        if (!email || !password || !rePassword) {
            return
        }
        setIsLoading(true)
        try {
            await RegisterUser({email: email, username: email, password: password})
            const logRes = await UserLogin({email: email, password: password})
            const userData = await GetMyData(logRes.data.access)

            localStorage.setItem('accessToken', logRes.data.access);
            localStorage.setItem('refreshToken', logRes.data.refresh);
            saveAccessToken(logRes.data.access)
            saveAuthData(userData.data)
            setLoggedIn(true)
            navigate('dashboard')

        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async () => {
        if (!email || !password) {
            return
        }
        setIsLoading(true)

        try {
            const logRes = await UserLogin({email: email, password: password})
            const userData = await GetMyData(logRes.data.access)

            localStorage.setItem('accessToken', logRes.data.access);
            localStorage.setItem('refreshToken', logRes.data.refresh);
            saveAccessToken(logRes.data.access)
            saveAuthData(userData.data)
            setLoggedIn(true)
            navigate('dashboard')
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className={"h-screen bg-zinc-50"}>
            <div className={"flex items-center p-4"}>
                <img className={"size-10"} src={LOGO} alt={"dddd"}/>
                <span className={"font-semibold text-xl"}>LoreFlow</span>
            </div>
            <main
                className={"characters-section flex flex-col w-full h-[80%] justify-center items-center bg-zinc-50"}>


                {/*<p className={"text-4xl font-semibold mb-2"}>LoreFlow</p>*/}
                <p className={"text-4xl font-semibold mb-1"}>
                    Welcome back!
                </p>
                <div onClick={() => toggle()} className={"text-xs text-zinc-500 cursor-pointer hover:underline mb-6"}>
                    {type === 'register'
                        ? 'Already have an account? Login'
                        : "Don't have an account? Register"}
                </div>

                {/*<p className={"mb-6 text-base"}>{type} with</p>*/}
                <section className={"border border-zinc-300 rounded-lg p-6 bg-white shadow min-w-sm"}>

                    {/*<form>*/}
                    <section>
                        <p className={"text-sm font-semibold mb-0.5"}>Email</p>
                        <input
                            className={"border border-zinc-300 rounded-md px-2 py-1 bg-white w-full text-xs mb-3"}
                            required
                            type="email"
                            placeholder="author@email.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <p className={"text-sm font-semibold mb-0.5"}>Password</p>
                        <input
                            className={"border border-zinc-300 rounded-md px-2 py-1 bg-white w-full text-xs mb-3"}
                            required
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        {type === 'register' &&
                            <><p className={"text-sm font-semibold mb-0.5"}>Repeat password</p>
                                <input
                                    className={"border border-zinc-300 rounded-md px-2 py-1 bg-white w-full text-xs mb-3"}
                                    required
                                    type="password"
                                    placeholder="Repeate password"
                                    value={rePassword}
                                    onChange={(event) => setRePassword(event.target.value)}
                                /></>}

                        {!passwordMatch && (
                            <p className={"text-xs text-red-500 mb-0.5"}>Passwords doesn't match.</p>
                        )}


                    </section>

                    <Group justify="space-between" mt="xl">
                        {type === 'register' ?
                            <button onClick={handleRegister}
                                    className={"w-full border border-zinc-300 rounded-lg p-2 bg-indigo-400 active:bg-indigo-300 flex justify-center"}>
                                {isLoading ? <div className={"flex justify-center items-center p-3"}><LoadingThreeDotsPulse/></div> : <p className={"text-white font-semibold"}>Register</p>}
                            </button> :
                            <button onClick={handleLogin}
                                    className={"w-full border border-zinc-300 rounded-lg p-2 bg-indigo-400 active:bg-indigo-300 flex justify-center"}>
                                {isLoading ? <div className={"flex justify-center items-center p-3"}><LoadingThreeDotsPulse/></div> : <p className={"text-white font-semibold"}>Login</p>}
                            </button>}

                    </Group>
                    {/*</form>*/}
                </section>

            </main>
        </div>


    )
}
export default Home
