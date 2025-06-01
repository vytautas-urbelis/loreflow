import AxiosMotion from "."
import {SceneInterface} from "../models/scene/scene.tsx";

// From book extracted or AI created
export const SaveGeneratedScene = async (token: string, scene: SceneInterface) => {
    return await AxiosMotion.post("/scenes/", scene, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const SaveNewScene = async (token: string, scene: SceneInterface,) => {
    return await AxiosMotion.post("/scenes/new/", scene, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
}

export const DeleteScene = async (token: string, sceneId: number | string | null) => {
    return await AxiosMotion.delete(`scenes/${sceneId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}


export const UpdateScene = async (
    token: string,
    scene: SceneInterface,
    scene_id: string | number) => {
    return await AxiosMotion.patch(`/scenes/${scene_id}/`, scene, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"

        }
    })
}

export const ReorderSceneListInPage = async (token: string, scenesOrder: object,) => {
    return await AxiosMotion.post("/reorder/scenes/", scenesOrder, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
}