import {create} from 'zustand';

// Define interfaces
export interface UserDataInterface {
    accessToken: string;
    id: string;
    email: string;
    username: string;
    ws_chanel_code: string;
    open_router_api_key: string;
    selected_model: string;
}

interface AuthStateInterface {
    isLoggedIn: boolean;
    authData: UserDataInterface;
    saveAccessToken: (accessToken: string) => void;
    saveAuthData: (payload: {
        id: string;
        email: string;
        username: string;
        ws_chanel_code: string;
        open_router_api_key: string;
    }) => void;
    saveSelectedModel: (selectedModel: string) => void;
    setLoggedIn: (state: boolean) => void;
}

// Create Zustand store
const useAuthStore = create<AuthStateInterface>((set) => ({
    isLoggedIn: false,
    authData: {
        accessToken: "",
        id: '',
        email: '',
        username: '',
        ws_chanel_code: '',
        open_router_api_key: '',
        selected_model: '',
    },

    saveAccessToken: (accessToken) => set((state) => ({
        authData: {...state.authData, accessToken}
    })),

    saveAuthData: (payload) => set((state) => ({
        authData: {
            ...state.authData,
            id: payload.id,
            email: payload.email,
            username: payload.username,
            ws_chanel_code: payload.ws_chanel_code,
            open_router_api_key: payload.open_router_api_key
        }
    })),

    saveSelectedModel: (selectedModel) => set((state) => ({
        authData: {...state.authData, selected_model: selectedModel}
    })),

    setLoggedIn: (currentState) => set(() => ({
        isLoggedIn: currentState
    }))
}));

export default useAuthStore;
