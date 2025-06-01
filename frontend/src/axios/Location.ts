import AxiosMotion from "."
import {LocationInterface} from "../models/location/location.tsx";

// From book extracted or AI created
export const AddLocationToProject = async (token: string, location: LocationInterface) => {
    return await AxiosMotion.post("/locations/", location, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const SaveNewLocation = async (token: string, location: FormData,) => {
    return await AxiosMotion.post("/locations/new/", location, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"
        }
    })
}

export const DeleteLocationImage = async (token: string, locationId: number | string) => {
    return await AxiosMotion.delete(`locations/delete-image/${locationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const DeleteLocation = async (token: string, locationId: number | string | null) => {
    return await AxiosMotion.delete(`locations/${locationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}


export const UpdateLocation = async (
    token: string,
    location: FormData,
    location_id: string | number) => {
    return await AxiosMotion.patch(`/locations/${location_id}/`, location, {
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data"

        }
    })
}