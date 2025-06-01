import AxiosMotion from "."
import {CharacterInterface} from "../models/character/character.ts";

export const AddCharactersToProject = async (token: string, character: CharacterInterface) => {
    return await AxiosMotion.post("/character/", character, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const SaveNewCharacter = async (token: string, character: FormData,) => {
    return await AxiosMotion.post("/character/new/", character, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"
        }
    })
}

export const DeleteCharacterImage = async (token: string, characterId: number | string) => {
    return await AxiosMotion.delete(`character/delete-image/${characterId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const DeleteCharacter = async (token: string, characterId: number | string | null) => {
    return await AxiosMotion.delete(`character/${characterId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}


export const UpdateCharacter = async (
    token: string,
    data: FormData,
    character_id: string | number) => {
    return await AxiosMotion.patch(`/character/${character_id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"

        }
    })
}

export const ExtractCharactersFromPdf = async (token: string, project_id: string | number) => {
    return await AxiosMotion.post(`/create-characters/`, {project_id}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

// export const GetMovieProject = async (token: string, id: string | undefined) => {
//     return await AxiosMotion.get(`/movie-project/${id}`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
// }
//
// export const UpdateMovieProject = async (token: string, id: string | undefined, data: FormData) => {
//     return await AxiosMotion.patch(`/movie-project/${id}/`, data, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//         }
//     })
// }
//
//
// export const DeleteMovieProject = async (token: string, id: number | string) => {
//     return await AxiosMotion.delete(`/movie-project/${id}/`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
// }
//
// export const GetListOfProjects = async (token: string) => {
//     return await AxiosMotion.get("/movie-project/", {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
// }