import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Character} from "../models/character/character.ts";
import {UpdateProject} from "../axios/Project.ts";
import {ProjectInterface} from "../models/project";
import useAuthStore from "../zustand/AuthStore.tsx";
import useProjectsStore from "../zustand/ProjectStore.tsx";
import useChatStore from "../zustand/Chat.ts";
import {AddSceneActions, StreamToExistingScene, StreamToNewScene} from "./actions/Scene.tsx";
import {AddCharacterActions} from "./actions/Character.tsx";
import {AddItemActions} from "./actions/Item.tsx";
import {AddLocationActions} from "./actions/Location.tsx";

// Create a context to share WebSocket state across components
interface WebSocketContextType {
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
});

// Custom hook to use the WebSocket context
export const useWebSocketConnection = () => useContext(WebSocketContext);

const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
    // State management
    const [readyUpdate, setReadyUpdate] = useState<boolean>(false);
    const [projectId, setProjectId] = useState<string | number | false>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

    // Refs
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectIntervalRef = useRef<number>(1000); // Initial reconnect delay

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const chanelCode = useAuthStore((state) => state.authData.ws_chanel_code);
    const project: ProjectInterface | undefined = useProjectsStore((state) => state.projectsList).find((pro) => pro.id === projectId);

    // Hooks for local state management
    const addMergeExtractedCharacter = useProjectsStore((state) => state.addMergeExtractedCharacter);
    const addUpdateProcess = useChatStore((state) => state.addUpdateProcess);
    // const appendStreamText = useChatStore((state) => state.appendStreamText);
    const appendStreamMessage = useChatStore((state) => state.addUpdateStreamMessage);
    const addSceneToChapter = useProjectsStore((state) => state.addSceneToChapter);
    const streamToExistingScene = useProjectsStore((state) => state.streamToExistingScene);
    const streamToNewScene = useProjectsStore((state) => state.streamToNewScene);
    const addCharacterToProject = useProjectsStore((state) => state.addCharacterToProject);
    const addItemToProject = useProjectsStore((state) => state.addItemToProject);
    const addLocationToProject = useProjectsStore((state) => state.addLocationToProject);

    // const esURL = `ws://0.0.0.0:8000/ws/chanel/${chanelCode}/`;

    const esURL =
        window.location.hostname === "localhost"
            ? `ws://0.0.0.0:8000/ws/chanel/${chanelCode}/`
            : `wss://loreflow.app/ws/chanel/${chanelCode}/`

    // Function to update server with characters
    useEffect(() => {
        const updateServerCharacters = async () => {
            try {
                if (!project) return;

                const formData = new FormData();
                formData.append("characters_json", JSON.stringify(project.characters_json));

                await UpdateProject(
                    accessToken,
                    project.id.toString(),
                    formData
                );
            } catch (e) {
                console.error("Error updating server characters:", e);
            } finally {
                setReadyUpdate(false);
            }
        };

        if (readyUpdate) {
            updateServerCharacters();
        }
    }, [readyUpdate, project, accessToken]);

    // Function to update project with characters
    const updateProject = useCallback(
        async (characters: Character[], projectId: number) => {
            for (let index = 0; index < characters.length; index++) {
                const character = characters[index];
                character["project"] = projectId;
                addMergeExtractedCharacter(projectId, character);
            }
            setReadyUpdate(true);
        },
        [addMergeExtractedCharacter]
    );


    // WebSocket connection setup with reconnection logic
    const connectWebSocket = useCallback(() => {
        if (!chanelCode) return;

        // Close existing connection if any
        if (ws.current) {
            ws.current.close();
        }

        // Create new WebSocket connection
        ws.current = new WebSocket(esURL);

        // Connection opened
        ws.current.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
            reconnectIntervalRef.current = 1000; // Reset reconnect delay on successful connection

            if (ws.current) {
                ws.current.send(JSON.stringify({message: "Web Socket Connected"}));
            }
        };

        // Listen for messages
        ws.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.characters) {
                    const receivedData = JSON.parse(data.characters);
                    const characters = receivedData.characters;
                    const project_id = receivedData.movie_project_id;
                    setProjectId(project_id);
                    updateProject(characters, project_id);
                }
                if (data.process) {
                    const process = JSON.parse(data.process);
                    addUpdateProcess(process)
                }
                // if (data.stream_text) {
                //     const streamText = JSON.parse(data.stream_text);
                //     console.log("stream_text:", streamText)
                //     // appendStreamText(streamText);
                // }
                if (data.stream_message) {
                    const streamMessage = JSON.parse(data.stream_message);
                    appendStreamMessage(
                        streamMessage.process, streamMessage.request_id, streamMessage.stream_message
                    );
                }
                if (data.stream_scene) {
                    const scene = JSON.parse(data.stream_scene);
                    StreamToNewScene(scene.scene, scene.project_id, scene.message, streamToNewScene)
                }
                if (data.stream_to_existing_scene) {
                    const scene = JSON.parse(data.stream_to_existing_scene);
                    StreamToExistingScene(scene.scene, scene.project_id, scene.message, scene.request_id, streamToExistingScene)
                }
                if (data.scene) {
                    const scene = JSON.parse(data.scene);
                    AddSceneActions(scene.scene, scene.project_id, addSceneToChapter)
                }
                if (data.character) {
                    const character = JSON.parse(data.character);
                    AddCharacterActions(character.character, character.project_id, addCharacterToProject);
                }
                if (data.item) {
                    const item = JSON.parse(data.item);
                    AddItemActions(item.item, item.project_id, addItemToProject);
                }
                if (data.location) {
                    const location = JSON.parse(data.location);
                    AddLocationActions(location.location, location.project_id, addLocationToProject);
                }


            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };

        // Connection closed
        ws.current.onclose = (event) => {
            console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
            setIsConnected(false);

            // Implement exponential backoff for reconnection
            const reconnectDelay = Math.min(30000, reconnectIntervalRef.current * 1.5);
            reconnectIntervalRef.current = reconnectDelay;

            console.log(`Attempting to reconnect in ${reconnectDelay / 1000} seconds...`);

            // Schedule reconnection
            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }

            reconnectTimeoutRef.current = window.setTimeout(() => {
                setReconnectAttempt(prev => prev + 1);
            }, reconnectDelay);
        };

        // Connection error
        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            // The onclose handler will be called after this
        };
    }, [chanelCode, esURL, updateProject]);

    // Connect WebSocket and handle reconnection
    useEffect(() => {
        if (chanelCode) {
            connectWebSocket();
        }

        // Cleanup function
        return () => {
            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }

            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connectWebSocket, reconnectAttempt, chanelCode]);

    // Provide WebSocket state to children components
    return (
        <WebSocketContext.Provider value={{isConnected}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;
