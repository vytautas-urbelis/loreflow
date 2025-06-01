import AxiosMotion from "."
import {ItemInterface} from "../models/item/item.tsx";

// From book extracted or AI created
export const AddItemToProject = async (token: string, item: ItemInterface) => {
    return await AxiosMotion.post("/items/", item, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const SaveNewItem = async (token: string, item: FormData,) => {
    return await AxiosMotion.post("/items/new/", item, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"
        }
    })
}

export const DeleteItemImage = async (token: string, characterId: number | string) => {
    return await AxiosMotion.delete(`items/delete-image/${characterId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const DeleteItem = async (token: string, characterId: number | string | null) => {
    return await AxiosMotion.delete(`items/${characterId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}


export const UpdateItem = async (
    token: string,
    data: FormData,
    item_id: string | number) => {
    return await AxiosMotion.patch(`/items/${item_id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"

        }
    })
}