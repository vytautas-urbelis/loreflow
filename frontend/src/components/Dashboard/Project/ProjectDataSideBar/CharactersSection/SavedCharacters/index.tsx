import {CharacterInterface} from "../../../../../../models/character/character.ts";
import CreateCharacterDialog from "../../../../Dialogs/CreateCharacterDialog";
import {useState} from "react";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {BiEdit} from "react-icons/bi";
import {DeleteCharacter} from "../../../../../../axios/Character.ts";
import {useParams} from "react-router";
import {ProjectInterface} from "../../../../../../models/project";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const SavedCharacter = ({character, project}: {
    character: CharacterInterface,
    project: ProjectInterface,
}) => {

    // States
    const [isCreateCharacterOpen, setIsCreateCharacterOpen] = useState(false)
    // const [isCharacterCardOpen, setIsCharacterCardOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Hooks
    // const dispatch = useAppDispatch()
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();

    // Hooks for local state management
    const deleteCharacterFromProject = useProjectsStore((state) => state.deleteCharacterFromProject)


    const deleteCharacter = async (character: CharacterInterface) => {

        try {
            await DeleteCharacter(accessToken, character.id)
            deleteCharacterFromProject(id ? id : "", character)
            setIsDeleting(false)

        } catch (error) {
            console.log(error);
        }

    }

    return (

        <div className={"flex flex-row justify-between gap-2 w-full"}>
            {/*<CharacterCard character={character} setIsCharacterCardOpen={setIsCharacterCardOpen}*/}
            {/*               isCharacterCardOpen={isCharacterCardOpen}/>*/}
            <div className={"flex flex-row gap-2"}>
                {character.image ?
                    <img src={character.image} alt={character.name} className={"size-10 object-cover rounded-sm"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div>
                    <div className={"text-xs"}>{character.name}</div>


                    <div className={"text-xs text-zinc-700"}>{character.role.type}</div>
                </div>
            </div>

            <div className={"flex flex-col justify-between items-end"}>
                {isDeleting ?
                    <div className={"flex justify-end w-full gap-1"}>
                        <div onClick={() => {
                            setIsDeleting(false)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60"}>
                            <FiXCircle/>
                        </div>
                        <div onClick={() => {
                            deleteCharacter(character)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60 "}>
                            <FiCheckCircle/></div>
                    </div> :
                    <div className={"flex justify-end w-full"}>
                        <div onClick={() => {
                            setIsDeleting(true)
                        }}
                             className={"text-zinc-400 duration-300 hover:text-zinc-700 text-sm opacity-40 hover:opacity-60"}>
                            <RiDeleteBin6Line/></div>
                    </div>
                }
                <div onClick={() => {
                    setIsCreateCharacterOpen(true)
                }} className={"text-zinc-400 duration-300 hover:text-zinc-700 text-base opacity-40 hover:opacity-60"}>
                    <BiEdit/></div>
            </div>

            <CreateCharacterDialog isCreateCharacterOpen={isCreateCharacterOpen}
                                   setIsCreateCharacterOpen={setIsCreateCharacterOpen}
                                   character={character} project={project}/>

        </div>


    )
}

export default SavedCharacter