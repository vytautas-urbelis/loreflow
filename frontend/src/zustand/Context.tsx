import {create} from 'zustand';
import {ChapterInterface, EmptyChapter} from "../models/chapter";

interface ContextStore {
    context: ChapterInterface
    selectedText: string,
    contextProject: boolean,
    setContext: (newContext: ChapterInterface) => void;
    setSelectedText: (text: string | undefined) => void;
    setContextProject: (bool: boolean) => void;
}

// Create Zustand store
const useContextStore = create<ContextStore>((set) => ({
        context: EmptyChapter(),
        selectedText: '',
        contextProject: false,


        setContext: (newContext) => set(() => {
            return {context: newContext}
        }),

        setSelectedText: (text) => set(() => {
            return {selectedText: text}
        }),

        setContextProject: (bool) => set(() => {
            return {contextProject: bool}
        }),

    })
)

export default useContextStore;

