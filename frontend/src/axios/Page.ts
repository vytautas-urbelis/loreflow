import AxiosMotion from "."
import {PageInterface} from "../models/chapter";

export const CreatePage = async (token: string, data: object) => {
    return await AxiosMotion.post("/pages/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const DeletePage = async (token: string, id: number | string) => {
    return await AxiosMotion.delete(`/pages/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const UpdatePage = async (
    token: string,
    data: PageInterface,
    id: string | number) => {
    return await AxiosMotion.patch(`/pages/${id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,

        }
    })
}

export const ReorderPageListInPage = async (token: string, pagesOrder: object,) => {
    return await AxiosMotion.post("/reorder/pages/", pagesOrder, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
}