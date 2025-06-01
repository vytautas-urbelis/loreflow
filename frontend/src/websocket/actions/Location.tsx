import {LocationInterface} from "../../models/location/location.tsx";
import {locationNotification} from "../../utils/Notifications.tsx";

export const AddLocationActions = (
    location: LocationInterface,
    projectId: string,
    addLocationToProject: (projectId: string, location: LocationInterface) => void) => {
    addLocationToProject(projectId, location);
    locationNotification(location)
}
