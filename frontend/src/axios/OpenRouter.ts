import axios from "axios";

const client = axios.create({
    baseURL: 'https://openrouter.ai/api/v1',
});

export const OpenRouterModels = async () => {
    return await client.get("/models", {
        headers: {}
    })
}

export const OpenRouterCredits = async (APIKey: string) => {
    return await client.get("/credits", {
        headers: {
            "Authorization": `Bearer ${APIKey}`
        }
    })
}