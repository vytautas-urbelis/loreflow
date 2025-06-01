import {CharacterInterface} from "../../models/character/character.ts";
import {characterNotification} from "../../utils/Notifications.tsx";

export const AddCharacterActions = (
    character: CharacterInterface,
    projectId: string,
    addCharacterToProject: (projectId: string, character: CharacterInterface) => void) => {
    addCharacterToProject(projectId, character);
    characterNotification(character)


}
