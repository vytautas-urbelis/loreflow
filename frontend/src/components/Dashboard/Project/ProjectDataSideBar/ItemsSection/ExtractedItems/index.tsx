import {Project, ProjectInterface} from "../../../../../../models/project";
import {UpdateProject} from "../../../../../../axios/Project.ts";
import {HiOutlineCheckCircle} from "react-icons/hi2";
import {IoCloseCircleOutline} from "react-icons/io5";
import {ItemInterface} from "../../../../../../models/item/item.tsx";
import {AddItemToProject} from "../../../../../../axios/Item.ts";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const ExtractedItems = ({item, isExtracting, project}: {
    item: ItemInterface,
    isExtracting: React.SetStateAction<boolean>,
    project: ProjectInterface,
}) => {

    // Hooks
    // const dispatch = useDispatch();
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList)
    const addMergeExtractedItem = useProjectsStore((state) => state.addMergeExtractedItem)
    const deleteItemFromProjectJson = useProjectsStore((state) => state.deleteItemFromProjectJson)


    const handleProjectUpdate = async (currentProject: ProjectInterface) => {
        const formData = new FormData();
        formData.append("characters_json", JSON.stringify(currentProject.characters_json));
        try {
            await UpdateProject(accessToken, project.id.toString(), formData)
        } catch (e) {
            console.log(e)
        }
    }


    const saveItem = async (item: ItemInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        try {
            const res = await AddItemToProject(accessToken, item)
            currentProject.addItem(res.data)
            currentProject.removeItemFromJson(res.data.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    const mergeItem = async (item: ItemInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        const projectId = project.id
        try {
            addMergeExtractedItem(projectId, item)
            deleteItemFromProjectJson(projectId, item)
            currentProject.removeItemFromJson(item.name)
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }
    }

    const getRelatedCharacter = (characterName: string) => {
        const character = project.characters.find(item => item.name.toLowerCase() === characterName.toLowerCase());
        if (character) {
            return true
        } else {
            return undefined;
        }
    }

    const deleteItem = async (item: ItemInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);

        try {
            currentProject.removeItemFromJson(item.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className={"flex gap-2 justify-between w-full relative"}>
            <div className={"flex flex-row gap-2"}>
                {item.image ?
                    <img src={item.image} alt={item.name} className={"size-10 object-cover"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div className={""}>
                    <div className={"text-xs"}>{item.name}</div>
                    <div className={"text-xs text-zinc-700"}>{item.description}</div>

                </div>
                {/*<p className={"text-xs absolute bottom-0 left-22 text-orange-300"}>From book</p>*/}

            </div>

            {getRelatedCharacter(item.name) ? <div className={" flex h-fit justify-end items-end h-full gap-1"}>

                    <div onClick={() => deleteItem(item)}
                         className={"  text-xs text-red-400 cursor-pointer hover:text-red-700 px-2 py-1 border border-red-400 rounded-xl"}>
                        Discard
                    </div>
                    <div onClick={() => {
                        mergeItem(item)
                    }}
                         className={" text-xs text-green-400  cursor-pointer hover:text-green-700 px-2 py-1 border border-gree-400 rounded-xl"}>
                        Merge
                    </div>

                </div> :
                <div className={" flex h-fit justify-end items-end h-full"}>

                    <div onClick={() => deleteItem(item)}
                         className={"  text-xl text-red-400 cursor-pointer hover:text-red-700"}>
                        <IoCloseCircleOutline/>
                    </div>
                    <div onClick={() => {
                        saveItem(item)
                    }}
                         className={" text-xl text-green-400  cursor-pointer hover:text-green-700"}>
                        <HiOutlineCheckCircle/>
                    </div>

                </div>}

        </div>


    )
}

export default ExtractedItems