import {Button, Dialog, DialogPanel, Field, Fieldset, Input, Label, Legend} from "@headlessui/react";
import {useState} from "react";
import {UpdateUserProfile} from "../../../../axios/Auth.ts";
import useAuthStore, {UserDataInterface} from "../../../../zustand/AuthStore.tsx";

const UserProfileDialog = ({isUserProfileOpen, setIsUserProfileOpen, userData}: {
    isUserProfileOpen: boolean,
    setIsUserProfileOpen: React.Dispatch<React.SetStateAction<boolean>>,
    userData: UserDataInterface,
}) => {

    // States
    const [openRouterAPI, setOpenRouterAPI] = useState(userData.open_router_api_key)

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const saveAuthData = useAuthStore((state) => state.saveAuthData)

    // Functions
    const save = async () => {
        try {
            // Updating project in backend
            const res = await UpdateUserProfile(accessToken, userData.id, {open_router_api_key: openRouterAPI})

            // Assigning data
            const id = res.data.id;
            const email = res.data.email;
            const username = res.data.username;
            const ws_chanel_code = res.data.ws_chanel_code;
            const open_router_api_key = res.data.open_router_api_key;

            // updating user profile
            saveAuthData({id, email, username, ws_chanel_code, open_router_api_key})

            // Closing dialog
            setIsUserProfileOpen(false)

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Dialog open={isUserProfileOpen}
                onClose={() => setIsUserProfileOpen(false)} transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel transition>
                    <Fieldset className="space-y-8 bg-linear-to-t from-sky-400 to-indigo-400 p-1 rounded-xl shadow-2xl">
                        <div className="space-y-8 bg-linear-to-t from-zinc-100 to-zinc-300 p-10 rounded-lg shadow-2xl">
                            <Legend className="text-lg font-bold ">{userData.username} profile</Legend>
                            <Field>
                                <Label className="block">OpenRouter API Key</Label>
                                <Input
                                    onChange={(e) => setOpenRouterAPI(e.target.value)}
                                    value={openRouterAPI}
                                    className="mt-3 w-80 xl:w-100 resize-none rounded-lg border-none bg-white py-1.5 px-3 text-sm/6 text-zinc-700 focus:outline-none"
                                    name="title"/>
                            </Field>
                            <div className={"w-full flex justify-end text-center"}>
                                <Button
                                    onClick={() => {
                                        save()
                                    }}
                                    className="rounded-md bg-zinc-700/60 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-zinc-700/90 active:bg-zinc-800"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Fieldset>
                </DialogPanel>
            </div>
        </Dialog>
    )

}

export default UserProfileDialog