import {Project, ProjectInterface} from "../../../../../../models/project";
import {AddCharactersToProject} from "../../../../../../axios/Character.ts";
import {CharacterInterface} from "../../../../../../models/character/character.ts";
import {UpdateProject} from "../../../../../../axios/Project.ts";
import {HiOutlineCheckCircle} from "react-icons/hi2";
import {IoCloseCircleOutline} from "react-icons/io5";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const ExtractedCharacter = ({character, isExtracting, project}: {
    character: CharacterInterface,
    isExtracting: React.SetStateAction<boolean>,
    project: ProjectInterface,
}) => {

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList)
    const addMergeExtractedCharacter = useProjectsStore((state) => state.addMergeExtractedCharacter)
    const deleteCharacterFromProjectJson = useProjectsStore((state) => state.deleteCharacterFromProjectJson)

    const handleProjectUpdate = async (currentProject: ProjectInterface) => {
        const formData = new FormData();
        formData.append("characters_json", JSON.stringify(currentProject.characters_json));
        try {
            await UpdateProject(accessToken, project.id.toString(), formData)
        } catch (e) {
            console.log(e)
        }
    }


    const saveCharacter = async (character: CharacterInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        try {
            const res = await AddCharactersToProject(accessToken, character)
            currentProject.addCharacter(res.data)
            currentProject.removeCharacterFromJson(res.data.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    const mergeCharacter = async (character: CharacterInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        const projectId = project.id
        try {
            addMergeExtractedCharacter(projectId, character)
            deleteCharacterFromProjectJson(projectId, character)
            currentProject.removeCharacterFromJson(character.name)
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

    const deleteCharacter = async (character: CharacterInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        try {
            currentProject.removeCharacterFromJson(character.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className={"flex gap-2 justify-between w-full relative"}>
            <div className={"flex flex-row gap-2"}>
                {character.image ?
                    <img src={character.image} alt={character.name} className={"size-10 object-cover"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div className={""}>
                    <div className={"text-xs"}>{character.name}</div>
                    <div className={"text-xs text-zinc-700"}>{character.role.type}</div>

                </div>
                {/*<p className={"text-xs absolute bottom-0 left-22 text-orange-300"}>From book</p>*/}

            </div>

            {getRelatedCharacter(character.name) ? <div className={" flex h-fit justify-end items-end h-full gap-1"}>

                    <div onClick={() => deleteCharacter(character)}
                         className={"  text-xs text-red-400 cursor-pointer hover:text-red-700 px-2 py-1 border border-red-400 rounded-xl"}>
                        Discard
                    </div>
                    <div onClick={() => {
                        mergeCharacter(character)
                    }}
                         className={" text-xs text-green-400  cursor-pointer hover:text-green-700 px-2 py-1 border border-gree-400 rounded-xl"}>
                        Merge
                    </div>

                </div> :
                <div className={" flex h-fit justify-end items-end h-full"}>

                    <div onClick={() => deleteCharacter(character)}
                         className={"  text-xl text-red-400 cursor-pointer hover:text-red-700"}>
                        <IoCloseCircleOutline/>
                    </div>
                    <div onClick={() => {
                        saveCharacter(character)
                    }}
                         className={" text-xl text-green-400  cursor-pointer hover:text-green-700"}>
                        <HiOutlineCheckCircle/>
                    </div>

                </div>}

        </div>


    )
}

export default ExtractedCharacter