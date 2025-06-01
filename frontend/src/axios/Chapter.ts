import AxiosMotion from "."
import {ChapterInterface} from "../models/chapter";

export const CreateChapter = async (token: string, data: object) => {
    return await AxiosMotion.post("/chapters/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const DeleteChapter = async (token: string, id: number | string) => {
    return await AxiosMotion.delete(`/chapters/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const UpdateChapter = async (
    token: string,
    chapter: ChapterInterface,
    chapter_id: string | number) => {
    return await AxiosMotion.patch(`/chapters/${chapter_id}/`, chapter, {
        headers: {
            Authorization: `Bearer ${token}`,

        }
    })
}
