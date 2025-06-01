import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {FaRegFilePdf} from "react-icons/fa";
import {ProjectInterface} from "../../../../../models/project";
import SavedCharacter from "./SavedCharacters";
import ExtractedCharacter from "./ExtractedCharacters";
import {AnimatePresence, motion} from 'framer-motion';
import SectionCollapseWrapper from "../../../../../wrappers/SectionCollapseWrapper.tsx";


const CharactersSection = ({project, isExtracting}: {
    project: ProjectInterface,
    isExtracting: React.SetStateAction<boolean>
}) => {

    const onDrop = useCallback((acceptedFiles: never) => {
        console.log(acceptedFiles);
    }, [])


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    return (


        <SectionCollapseWrapper label={`Characters ${project.characters.length}`}>
            {project && project.characters ?
                <AnimatePresence>
                    <div className={"flex flex-row w-full justify-start items-start gap-4 "}>
                        <div
                            // className={"grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 w-full justify-center transition overflow:hidden duration-300"}>
                            className={"grid grid-cols-1 gap-2 w-full justify-center transition overflow:hidden duration-300 overflow-auto"}>
                            {project.characters_json && <>
                                {project.characters_json.map((character, index: number) => (
                                    <motion.div
                                        initial={{opacity: 0, y: -20}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.001, delay: index * 0.02}}
                                        layout  // This is the key prop for your use case
                                        className={`${isExtracting && 'animate-pulse'} flex w-full duration-300 flex-row border-1 
                                rounded-sm p-1 bg-linear-to-t from-white to-zinc-50 border-gray-300`}
                                        key={index}>
                                        <ExtractedCharacter isExtracting={isExtracting} character={character}
                                                            project={project}/>
                                    </motion.div>
                                ))}
                            </>}
                            {project && <>
                                {project.characters.map((character, index: number) => (
                                    <motion.div
                                        initial={{opacity: 0, y: -20}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.001, delay: index * 0.02}}
                                        layout  // This is the key prop for your use case
                                        className={" flex w-full duration-300 flex-row border-1 rounded-sm p-1 " +
                                            "bg-linear-to-t from-white to-zinc-50 border-gray-300 hover:shadow-md"}
                                        key={index}>
                                        <SavedCharacter character={character} project={project}/>

                                    </motion.div>
                                ))}
                            </>}

                        </div>
                        {/*<div className={"w-100 h-200 bg-zinc-50 border-4 border-zinc-200 rounded-lg "}></div>*/}
                    </div>
                </AnimatePresence> :

                // <ChatStream/>
                <div {...getRootProps()} className={"flex w-full h-full items-center justify-center"}>
                    <div>
                        <input {...getInputProps()} />
                        {
                            !isDragActive &&
                            <div
                                className={"h-60 w-60 bg-zinc-50 rounded-2xl flex flex-col justify-center items-center border-zinc-200 border-dashed border-4"}>
                                <p className={"text-zinc-600 mb-2"}>Drop your book here...</p>
                                <div
                                    className={"text-6xl p-5 text-zinc-500 border-4 border-gray-100 rounded-2xl"}>
                                    <FaRegFilePdf/></div>
                            </div>
                        }
                    </div>
                </div>
            }

        </SectionCollapseWrapper>

    )
}

export default CharactersSection