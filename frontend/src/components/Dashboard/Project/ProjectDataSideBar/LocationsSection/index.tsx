import {ProjectInterface} from "../../../../../models/project";
import SavedLocation from "./SavedLocations";
import ExtractedLocation from "./ExtractedLocations";
import {AnimatePresence, motion} from 'framer-motion';
import SectionCollapseWrapper from "../../../../../wrappers/SectionCollapseWrapper.tsx";


const LocationsSection = ({project, isExtracting}: {
    project: ProjectInterface,
    isExtracting: React.SetStateAction<boolean>
}) => {

    return (


        <SectionCollapseWrapper label={`Locations ${project.locations.length}`}>
            {project && project.locations ?
                <AnimatePresence>
                    <div className={"flex flex-row w-full justify-start items-start gap-4 "}>
                        <div
                            // className={"grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 w-full justify-center transition overflow:hidden duration-300"}>
                            className={"grid grid-cols-1 gap-3 w-full justify-center transition overflow:hidden duration-300 overflow-auto "}>
                            {project.locations_json && <>
                                {project.locations_json.map((location, index: number) => (
                                    <motion.div
                                        initial={{opacity: 0, y: -20}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.001, delay: index * 0.02}}
                                        layout  // This is the key prop for your use case
                                        className={`${isExtracting && 'animate-pulse'} flex w-full duration-300 flex-row border-1 rounded-sm p-1 
                                bg-linear-to-t from-white to-zinc-50 border-gray-300 hover:shadow-md`}
                                        key={index}>
                                        <ExtractedLocation isExtracting={isExtracting} location={location}
                                                           project={project}/>
                                    </motion.div>
                                ))}
                            </>}
                            {project && <>
                                {project.locations.map((location, index: number) => (
                                    <motion.div
                                        initial={{opacity: 0, y: -20}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.001, delay: index * 0.02}}
                                        layout  // This is the key prop for your use case
                                        className={"flex w-full duration-300 flex-row border-1 rounded-sm p-1 " +
                                            "bg-linear-to-t from-white to-zinc-50 border-gray-300 hover:shadow-md"}
                                        key={index}>
                                        <SavedLocation location={location} project={project}/>

                                    </motion.div>
                                ))}
                            </>}

                        </div>
                        {/*<div className={"w-100 h-200 bg-zinc-50 border-4 border-zinc-200 rounded-lg "}></div>*/}
                    </div>
                </AnimatePresence> :

                <></>
            }

        </SectionCollapseWrapper>

    )
}

export default LocationsSection