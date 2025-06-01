import AxiosMotion from "."

export const RegisterUser = async (data: object) => {
    return await AxiosMotion.post(`/user/`, data, {})
}

export const UserLogin = async (data: object) => {
    return await AxiosMotion.post(`/token/`, data, {})
}

export const VerifyToken = async (data: object) => {
    return await AxiosMotion.post(`/token/verify/`, data, {})
}

export const RefreshToken = async (data: object) => {
    return await AxiosMotion.post(`/token/refresh/`, data, {})
}

export const GetMyData = async (token: string) => {
    return await AxiosMotion.get("/user/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const UpdateUserProfile = async (token: string, id: number | string, data: object) => {
    return await AxiosMotion.patch(`/user/${id}/`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}