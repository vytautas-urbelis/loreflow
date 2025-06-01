import {create} from 'zustand';
import {OpenRouterModelDataInterface} from "../models/openRouterModel/openRouterModel.tsx";

// Define interfaces
export interface OpenRouterModelsInterface {
    freeModels: OpenRouterModelDataInterface[];
    paidModels: OpenRouterModelDataInterface[];
}

interface OpenRouterStore {
    openRouterModels: OpenRouterModelsInterface;
    saveOpenRouterModels: (payload: {
        freeModels: OpenRouterModelDataInterface[];
        paidModels: OpenRouterModelDataInterface[];
    }) => void;
}

// Create Zustand store
const useOpenRouterStore = create<OpenRouterStore>((set) => ({
    openRouterModels: {
        freeModels: [],
        paidModels: [],
    },

    saveOpenRouterModels: ({freeModels, paidModels}) => set(() => ({
        openRouterModels: {freeModels, paidModels}
    }))
}));

export default useOpenRouterStore;
