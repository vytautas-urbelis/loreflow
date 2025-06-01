import {useState} from "react";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {BiEdit} from "react-icons/bi";
import {useParams} from "react-router";
import {ProjectInterface} from "../../../../../../models/project";
import {ItemInterface} from "../../../../../../models/item/item.tsx";
import CreateItemDialog from "../../../../Dialogs/CreateItemDialog";
import {DeleteItem} from "../../../../../../axios/Item.ts";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const SavedItems = ({item, project}: {
    item: ItemInterface,
    project: ProjectInterface,
}) => {

    // States
    const [isCreateItemOpen, setIsCreateItemOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();

    // Hooks for local state management
    const deleteItemFromProject = useProjectsStore((state) => state.deleteItemFromProject)


    const deleteItem = async (item: ItemInterface) => {

        try {
            await DeleteItem(accessToken, item.id)
            deleteItemFromProject(id ? id : "", item)

            setIsDeleting(false)

        } catch (error) {
            console.log(error);
        }

    }

    return (

        <div className={"flex flex-row justify-between gap-2 w-full"}>
            <div className={"flex flex-row gap-2"}>
                {item.image ?
                    <img src={item.image} alt={item.name} className={"size-10 object-cover rounded-sm"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div>
                    <div className={"text-xs text-zinc-900"}>{item.name}</div>


                    <div className={"text-xs text-zinc-500 max-w-46"}>{item.description?.substring(0, 54)}...</div>
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
                            deleteItem(item)
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
                    setIsCreateItemOpen(true)
                }} className={"text-zinc-400 duration-300 hover:text-zinc-700 text-base opacity-40 hover:opacity-60"}>
                    <BiEdit/></div>
            </div>

            <CreateItemDialog isCreateItemOpen={isCreateItemOpen}
                              setIsCreateItemOpen={setIsCreateItemOpen}
                              item={item} project={project}/>

        </div>


    )
}

export default SavedItems