import {SceneInterface} from "../../models/scene/scene.tsx";
import {sceneNotification} from "../../utils/Notifications.tsx";

export const AddSceneActions = (
    scene: SceneInterface,
    projectId: string,
    addSceneToChapter: (projectId: string, chapter: string, scene: SceneInterface) => void) => {
    addSceneToChapter(projectId, scene.chapter, scene)
    sceneNotification(scene)
}

export const StreamToNewScene = (
    scene: SceneInterface,
    projectId: string,
    message: string,
    streamToNewScene: (projectId: string, chapter: string, sceneId: string, message: string) => void) => {
    streamToNewScene(projectId, scene.chapter, scene.id, message)
}

export const StreamToExistingScene = (
    scene: SceneInterface,
    projectId: string,
    message: string,
    request_id: string,
    streamToExistingScene: (projectId: string, chapter: string, sceneId: string, message: string, request_id: string) => void) => {
    streamToExistingScene(projectId, scene.chapter, scene.id, message, request_id)
}