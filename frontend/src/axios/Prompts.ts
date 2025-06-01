import AxiosMotion from "."

export const EmptyChatPrompt = async (token: string, data: object) => {
    return await AxiosMotion.post("/prompts/em-prompt/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const StopProcess = async (token: string, data: object) => {
    return await AxiosMotion.post("/prompts/stop/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}
