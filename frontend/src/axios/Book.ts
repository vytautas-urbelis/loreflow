import AxiosMotion from "."

export const SaveBook = async (token: string, data: FormData) => {
    return await AxiosMotion.post(`/add-book/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const DeleteBook = async (token: string, id: number | string) => {
    return await AxiosMotion.delete(`/delete-book/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
