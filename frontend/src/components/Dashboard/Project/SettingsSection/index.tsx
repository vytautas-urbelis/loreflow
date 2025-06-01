import {useEffect, useState} from "react";
import {OpenRouterCredits} from "../../../../axios/OpenRouter.ts";
import useAuthStore from "../../../../zustand/AuthStore.tsx";
import UserProfileDialog from "../../Dialogs/UserProfileDialog";
import {NavLink} from "react-router";
import LOGO from "../../../../assets/logo.png";

const SettingsSection = () => {

    // States
    // const [selectedModel, setSelectedModel] = useState<OpenRouterModelDataInterface | undefined>();
    const [credits, setCredits] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [checked, setChecked] = useState<boolean>(false);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
    const [wrongKey, setWrongKey] = useState<boolean>(false);

    // Hooks
    const APIKey = useAuthStore((state) => state.authData.open_router_api_key);
    // const {isConnected} = useWebSocketConnection();
    const userData = useAuthStore((state) => state.authData);

    // Hooks for local store management

    // useEffects

    // UseEffect to fetch openRouter existing models and separating them into two lists free and paid
    useEffect(() => {

        // Fetching openRouter credits
        const getCredits = async () => {
            setIsLoading(true)
            try {
                const res = await OpenRouterCredits(APIKey)
                const credits = res.data.data.total_credits - res.data.data.total_usage;
                setCredits(credits)
                setWrongKey(false)
            } catch (e) {
                console.log(e)
                setWrongKey(true)
            } finally {
                setIsLoading(false)
            }
        }

        if (APIKey) {
            getCredits()
        }
    }, [APIKey])

    return (<>

        <div
            className={"w-full bg-white rounded-xs border-b border-gray-300 py-2 px-4 min-h-16  flex gap-2 justify-between fixed z-20 left-0 top-0 right-0"}>
            {/*<img src={LOGO} className={"h-10"} alt="Italian Trulli"/>*/}


            <div className={"flex flex-row w-fit items-start"}>
                <div className={"flex gap-1 flex-col items-start justify-start"}>
                    <NavLink to={'/dashboard'}>
                        <div className={"flex items-center mt-2"}>
                            <img className={"size-8"} src={LOGO} alt={"dddd"}/>
                            <span className={"font-semibold text-xl"}>LoreFlow</span>
                        </div>
                    </NavLink>

                    {/*<div className={"items-center flex gap-1"}>*/}
                    {/*    <div className={"text-xs text-zinc-500"}>Server Connection</div>*/}
                    {/*    {isConnected ? <div className={"w-2 h-2 rounded-full bg-green-400"}></div> :*/}
                    {/*        <div className={"w-2 h-2 rounded-full bg-red-400"}>*/}

                    {/*        </div>*/}
                    {/*    }*/}
                    {/*</div>*/}

                </div>
            </div>
            {APIKey ? <>
                    {isLoading ? <>Loading...</> :
                        <>
                            {wrongKey ?
                                <div>
                                    <UserProfileDialog isUserProfileOpen={isUserProfileOpen}
                                                       setIsUserProfileOpen={setIsUserProfileOpen}
                                                       userData={userData}/>
                                    <p onClick={() => {
                                        setIsUserProfileOpen(true)
                                    }} className={"text-sm hover:underline cursor-pointer"}>Wrong API Key entered</p>
                                </div>
                                :
                                <div className={"flex flex-col w-fit gap-1 pr-2"}>
                                    <div className={"flex flex-col w-fit  items-end"}>
                                        <p
                                            className={`text-xs text-zinc-500`}>OpenRouter credits:
                                        </p>
                                        <p
                                            className={`text-2xl text-zinc-800 font-semibold`}>
                                            {credits.toFixed(2)}
                                        </p>

                                    </div>
                                </div>}
                        </>
                    }
                </>
                : <div>
                    <UserProfileDialog isUserProfileOpen={isUserProfileOpen} setIsUserProfileOpen={setIsUserProfileOpen}
                                       userData={userData}/>
                    <p onClick={() => {
                        setIsUserProfileOpen(true)
                    }} className={"text-sm hover:underline cursor-pointer mt-3 font-semibold"}>Add OpenRouter API
                        Key</p>
                </div>}
        </div>

    </>)
}

export default SettingsSection;