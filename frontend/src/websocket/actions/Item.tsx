import {ItemInterface} from "../../models/item/item.tsx";
import {itemNotification} from "../../utils/Notifications.tsx";

export const AddItemActions = (
    item: ItemInterface,
    projectId: string,
    addItemToProject: (projectId: string, item: ItemInterface) => void) => {
    addItemToProject(projectId, item);
    itemNotification(item)

}
