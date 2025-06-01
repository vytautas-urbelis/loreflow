import {Button} from "@headlessui/react";
import {useEffect, useRef, useState} from "react";
import {GrSend} from "react-icons/gr";
import useAuthStore from "../../../zustand/AuthStore.tsx";
import TextareaAutosize from "react-textarea-autosize";
import {EmptyChatPrompt, StopProcess} from "../../../axios/Prompts.ts";
import useChatStore, {ChatMessage} from "../../../zustand/Chat.ts";
import ProcessTimeline from "./ProcessMessage";
import {UpdateProject} from "../../../axios/Project.ts";
import {useClickOutside} from "@mantine/hooks";
import {LuBrain} from "react-icons/lu";
import ChatPassingModels from "./passingModels";
import useContextStore from "../../../zustand/Context.tsx";
import {TiDelete} from "react-icons/ti";
import {EmptyChapter} from "../../../models/chapter";
import {OpenRouterModelDataInterface} from "../../../models/openRouterModel/openRouterModel.tsx";
import useOpenRouterStore from "../../../zustand/OpenRouterModels.ts";
import {OpenRouterModels} from "../../../axios/OpenRouter.ts";
import {FaStop} from "react-icons/fa";
import UserProfileDialog from "../Dialogs/UserProfileDialog";


const ChatComponent = ({projectId}: {
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
    isFocused: boolean,
    projectId: string,
}) => {

    // States
    const [userPrompt, setUserPrompt] = useState<string>('')
    const [isFocused, setIsFocused] = useState(false);
    const [isModelsOpen, setIsModelsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedOpenRouterModel, setSelectedModel] = useState<OpenRouterModelDataInterface | undefined>(undefined);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);


    // Hooks
    const addUserPrompt = useChatStore((state) => state.addUserPrompt);
    const setChat = useChatStore((state) => state.setChat)
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const userData = useAuthStore((state) => state.authData);
    const chatMessages = useChatStore((state) => state.chat)
    const chatRef = useClickOutside(() => setIsFocused(false));
    const context = useContextStore((store) => store.context);
    const selectedContextText = useContextStore((state) => state.selectedText)
    const selectedModel = useAuthStore((state) => state.authData.selected_model);
    const APIKey = useAuthStore((state) => state.authData.open_router_api_key);
    const openRouterModels = useOpenRouterStore((state) => state.openRouterModels);
    const contextProject = useContextStore((state) => state.contextProject);
    const isProcessing = useChatStore(
        state => state.chat.length > 0 && state.chat[state.chat.length - 1].status === 'in_progress'
    );

    // Hooks to manage local states
    const setContext = useContextStore((store) => store.setContext);
    const setSelectedContextText = useContextStore((state) => state.setSelectedText)
    const saveOpenRouterModels = useOpenRouterStore((state) => state.saveOpenRouterModels);
    const setContextProject = useContextStore((state) => state.setContextProject);
    const updateProcess = useChatStore((state) => state.addUpdateProcess)

    // References
    const messagesRef = useRef<HTMLDivElement>(null);

    // UseEffects
    // UseEffect to fetch openRouter existing models and separating them into two lists free and paid
    useEffect(() => {
        const loadOpenRouterModels = async () => {
            setIsLoading(true)
            try {
                const res = await OpenRouterModels()
                const listOfModels = res.data.data
                const freeModels: OpenRouterModelDataInterface[] = []
                const paidModels: OpenRouterModelDataInterface[] = []
                for (let i = 1; i < listOfModels.length; i++) {
                    if (listOfModels[i].pricing.completion === "0") {
                        freeModels.push(listOfModels[i]);
                    } else {
                        paidModels.push(listOfModels[i]);
                    }
                }
                saveOpenRouterModels({freeModels, paidModels})

            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false)
            }
        }
        // If there are no saved models in local store, fetch models
        if (openRouterModels.paidModels.length === 0) {
            loadOpenRouterModels()
        }
    }, [APIKey])

    // Update chat in database when process is finished
    useEffect(() => {
        // Scroll to bottom if length of chat messages changed
        messagesRef.current?.scrollIntoView({behavior: "smooth"});
        if (!isProcessing) {
            updateChat(chatMessages)
        }
    }, [chatMessages])

    // Check if chat is empty ad project to prompt
    useEffect(() => {
        if (chatMessages.length > 0) {
            setContextProject(false)
        } else {
            setContextProject(true)
        }
    }, [chatMessages]);

    // Set selected model if it is selected in local state
    useEffect(() => {
        const model = openRouterModels.paidModels.find((model: OpenRouterModelDataInterface) => model.id === selectedModel)
        if (model) {
            setSelectedModel(model)
        } else {
            setSelectedModel(undefined)
        }
    }, [openRouterModels, selectedModel]);

    // Functions
    const updateChat = async (chatMessages: ChatMessage[]) => {
        const formData = new FormData();

        // If chat is being cleaned then chat_messages also are cleaned
        if (chatMessages.length === 0) {
            formData.append("chat_messages", JSON.stringify(chatMessages));
        }

        formData.append("chat", JSON.stringify(chatMessages));
        try {
            await UpdateProject(accessToken, projectId, formData)
        } catch (e) {
            console.error(e)
        }
    }

    // Send prompt to backend
    const handleChatPrompt = async () => {
        // If prompt is empty stop operation
        if (userPrompt === '') {
            return;
        }
        // set context variables
        const chapter = context.id ? context : null;
        // const page = context.pages[0] ? context.pages[0] : null;
        const scene = chapter?.scenes[0] ? chapter.scenes[0] : null;

        try {
            // Send data to backend
            const res = await EmptyChatPrompt(accessToken,
                {
                    project_id: projectId,
                    user_prompt: userPrompt,
                    chapter: chapter,
                    scene: scene,
                    selectedContextText: selectedContextText,
                    contextProject: contextProject,
                });
            // Clean prompt
            setUserPrompt('')

            // Clean context
            setContext(EmptyChapter())
            setSelectedContextText('')

            // Add user prompt to chat
            addUserPrompt(userPrompt, res.data.request_id)
        } catch (e) {
            console.error(e);
        }
    }

    // Function to clean chat history
    const cleanChatMessages = async () => {
        if (chatMessages.length == 0) {
            return;
        }
        try {
            await updateChat([])
            setChat([])
        } catch (e) {
            console.error(e)
        }
    }

    // Function to delete scene from context
    const handleDeleteSceneFromContext = () => {
        // const page = context.scenes[0]
        // const updatedPage = {...page, scenes: []}
        const updatedChapter = {...context, scenes: []};
        setContext(updatedChapter)
        setSelectedContextText('')
    }

    // Submit prompt when Enter key pressed
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Check if Enter is pressed without Shift or Ctrl (to allow multiline with Shift+Enter)
        if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
            event.preventDefault(); // Prevent newline
            handleChatPrompt()
        }
    };

    const stopProcess = async () => {
        const currentProcessId = chatMessages[chatMessages.length - 1].process_id
        const currentRequestId = chatMessages[chatMessages.length - 1].request_id
        try {
            const res = await StopProcess(accessToken, {process_id: currentProcessId, request_id: currentRequestId})
            updateProcess(res.data)
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }


    }

    return (

        <div ref={chatRef}>
            <div
                className={` ${isFocused ? ' opacity-100 mb-8 relative' : 'bottom-[-600px] opacity-0 absolute'} h-140 bg-white  transition-discrete 
                 duration-300 border border-gray-400 rounded-lg shadow-sm z-40 overflow:hidden duration-300 overflow-auto`}>
                <div
                    className="w-180 rounded-lg border-none  p-6 flex items-end">
                    <ProcessTimeline messages={chatMessages} messagesRef={messagesRef}/>
                </div>
            </div>
            <div
                className="relative border border-gray-400 rounded-lg shadow-sm z-50">
                <div className=" block w-180 rounded-lg border-none bg-white">

                    <div className={"h-fit w-full"}>
                        <div className={"static flex w-full justify-end items-start gap-2 pt-2 pr-2"}>
                            {isModelsOpen &&
                                <div className={"absolute bottom-33 right-0"}><ChatPassingModels
                                    setIsModelsOpen={setIsModelsOpen}/>
                                </div>}

                            <div className={"flex flex-col"}>
                                {selectedOpenRouterModel && !isLoading &&
                                    <div className={"flex items-start"}>
                                        <p className={"text-xs text-zinc-900 font-semibold"}>{selectedOpenRouterModel.name}
                                        </p>
                                    </div>
                                }
                                {selectedOpenRouterModel && !isLoading &&
                                    <div className={"flex justify-end text-center gap-1"}>
                                        <p className={"text-[10px] text-zinc-700 font-semibold"}>out</p>
                                        <p className={"text-[10px] text-red-400 font-semibold"}>
                                            {(parseFloat(selectedOpenRouterModel.pricing.completion) * 1000000).toFixed(2)} USD,
                                        </p>
                                        <p className={"text-[10px] text-zinc-700 font-semibold"}>in</p>
                                        <p className={"text-[10px] text-red-400 font-semibold"}>
                                            {(parseFloat(selectedOpenRouterModel.pricing.prompt) * 1000000).toFixed(2)} USD
                                        </p>
                                    </div>
                                }</div>

                            <div className={"flex justify-end text-center  bottom-26 right-16"}>
                                <Button
                                    onClick={() => {
                                        setIsModelsOpen(!isModelsOpen);
                                    }}
                                    className="rounded-lg bg-zinc-700/80 p-1 font-medium text-white focus:outline-none hover:bg-zinc-700/90 active:bg-zinc-300"
                                >
                                    <p className={"text-xs"}><LuBrain/>
                                    </p>
                                </Button>
                            </div>
                            <div className={"flex justify-end text-center  bottom-26 right-3"}>
                                <Button
                                    onClick={() => {
                                        cleanChatMessages();
                                    }}
                                    className=" rounded-lg bg-zinc-700/80 py-0.5 px-2 font-medium text-white focus:outline-none hover:bg-zinc-700/90 active:bg-zinc-300"
                                >
                                    <p className={"text-xs"}>Clean</p>
                                </Button>
                            </div>
                        </div>

                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleChatPrompt();
                        }}
                    >
                        <UserProfileDialog isUserProfileOpen={isUserProfileOpen}
                                           setIsUserProfileOpen={setIsUserProfileOpen}
                                           userData={userData}/>
                        {!APIKey ?
                            <div onClick={() => {
                                setIsUserProfileOpen(true)
                            }}
                                 className={"h-20 w-full items-center text center flex justify-center cursor-pointer font-semibold"}>
                                Add OpenRouter API Key
                            </div> :
                            <TextareaAutosize
                                onKeyDown={handleKeyDown}
                                onClick={() => setIsFocused(true)}

                                onChange={(e) => setUserPrompt(e.target.value)}
                                value={userPrompt}
                                className="block w-180 resize-none rounded-lg border-none bg-white py-1.5 px-3 text-base/6 text-zinc-700 focus:outline-none pt-"
                                minRows={2}
                                maxRows={6} // Maximum of 6 rows
                            />}

                    </form>
                    <div className="flex items-center gap-1 pl-3 pb-2 pb-1 text-sm text-zinc-500"><p>Context: </p>
                        <Button
                            onClick={() => {
                                setContextProject(!contextProject)
                            }}
                            className={`rounded-md 
                            ${contextProject ? "bg-indigo-700/80 text-white hover:bg-indigo-700/90" :
                                "bg-white text-zinc-400 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 hover:text-zinc-500 "} 
                                px-2 py-0 text-xs font-medium   active:bg-indigo-300`}
                        >
                            <p className={"text-xs"}>Project</p>
                        </Button>
                        {context.id &&
                            <div
                                className="flex items-center gap-1 rounded-md bg-[#ffb442] px-1 pl-2 py-0 text-xs font-medium text-white focus:outline-none cursor-default"
                            >
                                <p className={"text-xs text-zinc-700"}>Chapter {context.name}</p>
                                <p onClick={() => {
                                    setContext(EmptyChapter())
                                    setSelectedContextText('')
                                }} className={"text-base text-zinc-700"}>
                                    <TiDelete/></p>
                            </div>}
                        {/*{context.pages[0] &&*/}
                        {/*    <div*/}
                        {/*        className="flex items-center gap-1 rounded-md bg-[#ffb442] px-1 pl-2 py-0 text-xs font-medium text-white focus:outline-none cursor-default"*/}
                        {/*    >*/}
                        {/*        <p className={"text-xs text-zinc-700"}>Page {context.pages[0].sequence}</p>*/}
                        {/*        <p onClick={() => {*/}
                        {/*            setContext({...context, pages: []})*/}
                        {/*            setSelectedContextText('')*/}
                        {/*        }} className={"text-base text-zinc-700"}>*/}
                        {/*            <TiDelete/></p>*/}
                        {/*    </div>}*/}
                        {context.scenes[0] && <div
                            className="flex items-center gap-1 rounded-md bg-[#ffb442] px-1 pl-2 py-0 text-xs font-medium text-white focus:outline-none cursor-default"
                        >
                            <p className={"text-xs text-zinc-700"}>Scene {context.scenes[0].sequence}</p>
                            <p onClick={() => handleDeleteSceneFromContext()}
                               className={"text-base text-zinc-700"}>
                                <TiDelete/></p>
                        </div>}

                        {selectedContextText !== '' && <div
                            className="flex items-center gap-1 rounded-md bg-[#ffb442] px-1 pl-2 py-0 text-xs font-medium text-white focus:outline-none cursor-default"
                        >
                            <p className={"text-xs text-zinc-700"}>Text</p>
                            <p onClick={() => setSelectedContextText('')} className={"text-base text-zinc-700"}>
                                <TiDelete/></p>
                        </div>}

                    </div>
                </div>
                {isProcessing ? <div className={"flex justify-end text-center absolute bottom-2 right-2"}>
                        <Button
                            onClick={() => {
                                stopProcess()
                            }}
                            className="rounded-full bg-indigo-700/80 p-1.5 text-xs font-medium text-white focus:outline-none hover:bg-indigo-700/90 active:bg-indigo-300"
                        >
                            <p className={"text-xs"}><FaStop/></p>
                        </Button>
                    </div> :
                    <div className={"flex justify-end text-center absolute bottom-2 right-2"}>
                        <Button
                            onClick={() => {
                                handleChatPrompt();
                            }}
                            className="rounded-full bg-indigo-700/80 p-1.5 text-xs font-medium text-white focus:outline-none hover:bg-indigo-700/90 active:bg-indigo-300"
                        >
                            <p className={"text-sm"}><GrSend/></p>
                        </Button>
                    </div>}


            </div>

        </div>
    )

}

export default ChatComponent