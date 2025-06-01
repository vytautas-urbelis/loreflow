import {useState} from "react";
import {FiCheckCircle, FiXCircle} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {BiEdit} from "react-icons/bi";
import {useParams} from "react-router";
import {ProjectInterface} from "../../../../../../models/project";
import {LocationInterface} from "../../../../../../models/location/location.tsx";
import {DeleteLocation} from "../../../../../../axios/Location.ts";
import CreateLocationDialog from "../../../../Dialogs/CreateLocationDialog";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const SavedLocation = ({location, project}: {
    project: ProjectInterface,
    location: LocationInterface,
}) => {

    // States
    const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);
    const {id} = useParams();

    // Hooks for local state management
    const deleteLocationFromProject = useProjectsStore((state) => state.deleteLocationFromProject)


    const deleteLocation = async (location: LocationInterface) => {

        try {
            await DeleteLocation(accessToken, location.id)
            // dispatch(deleteLocationFromProject({projectId: id ? id : "", location}))
            deleteLocationFromProject(id ? id : "", location)
            setIsDeleting(false)

        } catch (error) {
            console.log(error);
        }

    }

    return (

        <div className={"flex flex-row justify-between gap-2 w-full"}>
            <div className={"flex flex-row gap-2"}>
                {location.image ?
                    <img src={location.image} alt={location.name} className={"size-10 object-cover rounded-sm"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div>
                    <div className={"text-xs"}>{location.name}</div>


                    <div className={"text-xs text-zinc-700 max-w-46"}>{location.description?.substring(0, 54)}</div>
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
                            deleteLocation(location)
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
                    setIsCreateLocationOpen(true)
                }} className={"text-zinc-400 duration-300 hover:text-zinc-700 text-base opacity-40 hover:opacity-60"}>
                    <BiEdit/></div>
            </div>

            <CreateLocationDialog isCreateLocationOpen={isCreateLocationOpen}
                                  setIsCreateLocationOpen={setIsCreateLocationOpen}
                                  location={location} project={project}/>

        </div>


    )
}

export default SavedLocation