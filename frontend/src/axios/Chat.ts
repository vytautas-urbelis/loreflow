import AxiosMotion from "."

export const UpdateChat = async (token: string, id: string | undefined | number, data: object) => {
    return await AxiosMotion.patch(`/projects/${id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}