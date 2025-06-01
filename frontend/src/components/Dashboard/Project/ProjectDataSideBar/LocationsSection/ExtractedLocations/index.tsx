import {Project, ProjectInterface} from "../../../../../../models/project";
import {UpdateProject} from "../../../../../../axios/Project.ts";
import {HiOutlineCheckCircle} from "react-icons/hi2";
import {IoCloseCircleOutline} from "react-icons/io5";
import {LocationInterface} from "../../../../../../models/location/location.tsx";
import {AddLocationToProject} from "../../../../../../axios/Location.ts";
import useProjectsStore from "../../../../../../zustand/ProjectStore.tsx";
import useAuthStore from "../../../../../../zustand/AuthStore.tsx";


const ExtractedLocation = ({location, isExtracting, project}: {
    location: LocationInterface,
    isExtracting: React.SetStateAction<boolean>,
    project: ProjectInterface,
}) => {

    // Hooks
    const accessToken = useAuthStore((state) => state.authData.accessToken);

    // Hooks for local state management
    const updateProjectInList = useProjectsStore((state) => state.updateProjectInList)
    const addMergeExtractedLocation = useProjectsStore((state) => state.addMergeExtractedLocation)
    const deleteLocationFromProjectJson = useProjectsStore((state) => state.deleteLocationFromProjectJson)

    // Functions

    // Update project in database
    const handleProjectUpdate = async (currentProject: ProjectInterface) => {
        const formData = new FormData();
        formData.append("characters_json", JSON.stringify(currentProject.characters_json));
        try {
            await UpdateProject(accessToken, project.id.toString(), formData)
        } catch (e) {
            console.log(e)
        }
    }


    // Save Locations in database and local storage
    const saveLocation = async (location: LocationInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        try {
            const res = await AddLocationToProject(accessToken, location)
            currentProject.addLocation(res.data)
            currentProject.removeLocationFromJson(res.data.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    const mergeLocation = async (location: LocationInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        const projectId = project.id
        try {
            addMergeExtractedLocation(projectId, location)
            deleteLocationFromProjectJson(projectId, location)
            currentProject.removeLocationFromJson(location.name)
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }
    }

    const getRelatedLocation = (locationName: string) => {
        const location = project.locations.find(location => location.name.toLowerCase() === locationName.toLowerCase());
        if (location) {
            return true
        } else {
            return undefined;
        }
    }

    const deleteLocation = async (location: LocationInterface) => {
        if (isExtracting) {
            return
        }
        const currentProject = Project.from(project);
        try {
            currentProject.removeLocationFromJson(location.name)
            updateProjectInList(currentProject.toJSON());
            await handleProjectUpdate(currentProject)
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className={"flex gap-2 justify-between w-full relative"}>
            <div className={"flex flex-row gap-2"}>
                {location.image ?
                    <img src={location.image} alt={location.name} className={"size-10 object-cover"}/> :
                    <div className={"size-10 bg-zinc-100 rounded-md"}></div>
                }
                <div className={""}>
                    <div className={"text-xs"}>{location.name}</div>
                    <div className={"text-xs text-zinc-700"}>{location.description}</div>

                </div>
                {/*<p className={"text-xs absolute bottom-0 left-22 text-orange-300"}>From book</p>*/}

            </div>

            {getRelatedLocation(location.name) ? <div className={" flex h-fit justify-end items-end h-full gap-1"}>

                    <div onClick={() => deleteLocation(location)}
                         className={"  text-xs text-red-400 cursor-pointer hover:text-red-700 px-2 py-1 border border-red-400 rounded-xl"}>
                        Discard
                    </div>
                    <div onClick={() => {
                        mergeLocation(location)
                    }}
                         className={" text-xs text-green-400  cursor-pointer hover:text-green-700 px-2 py-1 border border-gree-400 rounded-xl"}>
                        Merge
                    </div>

                </div> :
                <div className={" flex h-fit justify-end items-end h-full"}>

                    <div onClick={() => deleteLocation(location)}
                         className={"  text-xl text-red-400 cursor-pointer hover:text-red-700"}>
                        <IoCloseCircleOutline/>
                    </div>
                    <div onClick={() => {
                        saveLocation(location)
                    }}
                         className={" text-xl text-green-400  cursor-pointer hover:text-green-700"}>
                        <HiOutlineCheckCircle/>
                    </div>

                </div>}

        </div>


    )
}

export default ExtractedLocation