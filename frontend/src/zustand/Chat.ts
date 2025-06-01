import {create} from 'zustand';
import {Process} from "../models/process/process.tsx";

export interface ChatMessage {
    request_id: string;
    process_id: string;
    type: string;
    status: string;
    user_prompt: string;
    processes: Process[];
    stream_message: string[];
}

interface ChatStore {
    chat: ChatMessage[];
    setChat: (messages: ChatMessage[] | []) => void;

    addUserPrompt: (
        user_prompt: string,
        request_id: string
    ) => void;

    addUpdateProcess: (message: {
        request_id: string,
        process_id: string,
        process: Process
    }) => void;


    // appendStreamText: (params: {
    //     request_id: string;
    //     process_id: string;
    //     text: string
    // }) => void;

    addUpdateStreamMessage: (
        process: Process,
        request_id: string,
        stream_message: string,
    ) => void;
}

// Create Zustand store
const useChatStore = create<ChatStore>((set) => ({
        chat: [],

        addUserPrompt: (user_prompt: string, request_id: string) => set((state) => {
            // Create new chat message
            const newChatMessage: ChatMessage = {
                request_id,
                process_id: '',
                status: 'succeeded',
                type: "user_prompt",
                user_prompt: user_prompt,
                processes: [],
                stream_message: []
            };
            return {chat: [...state.chat, newChatMessage]};
        }),

        addUpdateProcess: (message) => set((state) => {
            const {request_id, process} = message;

            // Check if chat message exists
            const updatedMessage = state.chat.find(msg => msg.request_id === request_id && msg.type === process.type);

            if (updatedMessage) {
                if (updatedMessage) {
                    updatedMessage.status = process.status;
                    updatedMessage.processes = process.sub_processes;
                }

                // Update existing chat message
                const updatedChat = state.chat.map((mess) => mess.request_id === request_id && mess.type === process.type ?
                    updatedMessage : mess
                );

                return {chat: updatedChat};
            } else {
                // Create new chat message
                const newChatMessage: ChatMessage = {
                    request_id,
                    process_id: process.id,
                    status: process.status,
                    type: process.type,
                    user_prompt: '',
                    processes: process.sub_processes,
                    stream_message: []
                };
                return {chat: [...state.chat, newChatMessage]};
            }
        }),

        setChat: (messages) => set(() => {
            return {chat: messages}

        }),

        addUpdateStreamMessage: (process: Process, request_id: string, stream_message: string) =>
            set((state) => {
                // Find message by both request_id AND type
                const chatIndex = state.chat.findIndex(
                    msg => msg.request_id === request_id && msg.type === process.type
                );

                // If message doesn't exist, create a new one
                if (chatIndex === -1) {
                    const newChatMessage = {
                        request_id,
                        process_id: process.id,
                        status: process.status,
                        type: process.type,
                        user_prompt: '',
                        processes: [],
                        stream_message: [stream_message] // Initialize with the new text
                    }

                    return {
                        chat: [...state.chat, newChatMessage]
                    };
                } else {

                    // If message exists, append to its stream_message
                    const streamMessage = state.chat[chatIndex];
                    const updatedStreamMessage = {
                        ...streamMessage,
                        stream_message: [...streamMessage.stream_message, stream_message]
                    };
                    updatedStreamMessage.status = process.status;

                    // return {chat: state.chat[chatIndex] = updatedStreamMessage}
                    return {chat: state.chat.map((message) => message.request_id === request_id && message.type === process.type ? updatedStreamMessage : message)}
                }
                
            })
    })
)

export default useChatStore;

