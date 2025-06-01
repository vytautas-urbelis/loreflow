import {useClickOutside} from "@mantine/hooks";
import {UpdateUserProfile} from "../../../../axios/Auth.ts";
import useAuthStore from "../../../../zustand/AuthStore.tsx";
import useOpenRouterStore from "../../../../zustand/OpenRouterModels.ts";
import React from "react";

const ChatPassingModels = ({setIsModelsOpen}: {
    setIsModelsOpen: (boolean: boolean) => void;
}) => {

    const excludeWords = ['PaLM', 'Search', 'Gemma', "GPT-3.5", "-mini", " Mini", " nano", " Nano"];

    // Hooks
    const modelsRef = useClickOutside(() => setIsModelsOpen(false));
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const userData = useAuthStore((state) => state.authData);
    const paidModels = useOpenRouterStore((state) => state.openRouterModels.paidModels);

    const openRouterModels = React.useMemo(() => {
        return paidModels
            .filter(
                (model) =>
                    (model.name.startsWith("Google") || model.name.startsWith("OpenAI")) &&
                    !excludeWords.some(word => model.name.includes(word))
            )
            .sort((a, b) => {
                // Handle potential undefined/null values for pricing or completion
                const aPrice = a.pricing?.completion ?? Infinity;
                const bPrice = b.pricing?.completion ?? Infinity;
                return parseFloat(bPrice) - parseFloat(aPrice)
            });
    }, [paidModels]);

    // Hooks for local store management
    const saveSelectedModel = useAuthStore((state) => state.saveSelectedModel);

    // handle model select
    const selectModel = async (id: string) => {
        try {
            // Updating project in backend
            await UpdateUserProfile(accessToken, userData.id, {selected_model: id})
            saveSelectedModel(id)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div ref={modelsRef} className="bg-white p-2 border border-zinc-300 rounded-lg max-h-160 overflow-y-auto">
            <ul>
                {openRouterModels.map((model) => (
                    <li key={model.id}>
                        <div onClick={() => selectModel(model.id)}
                             className={"text-xs hover:font-semibold cursor-pointer"}>{model.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default ChatPassingModels;