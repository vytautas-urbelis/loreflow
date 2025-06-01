import AxiosMotion from "."

export const CreateProject = async (token: string, data: FormData) => {
    return await AxiosMotion.post("/projects/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const GetProject = async (token: string, id: string | undefined) => {
    return await AxiosMotion.get(`/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const UpdateProject = async (token: string, id: string | undefined | number, data: FormData) => {
    return await AxiosMotion.patch(`/projects/${id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

// export const UpdateMovieProjectCharacters = async (token: string, id: string | undefined, characters: Character[]) => {
//     return await AxiosMotion.patch(`/movie-project/${id}/`,
//         {characters},
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
// }

export const DeleteProject = async (token: string, id: number | string) => {
    return await AxiosMotion.delete(`/projects/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const GetListOfProjects = async (token: string) => {
    return await AxiosMotion.get("/projects/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}