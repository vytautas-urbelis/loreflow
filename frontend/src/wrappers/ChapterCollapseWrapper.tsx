import {useState} from 'react'
import {LiaAngleDoubleDownSolid, LiaAngleDoubleUpSolid} from "react-icons/lia";
import {ChapterInterface} from "../models/chapter";
import {ProjectInterface} from "../models/project";
import {CiMenuKebab} from "react-icons/ci";
import CreateChapterDialog from "../components/Dashboard/Dialogs/CreateChapterDialog";


const ChapterCollapseWrapper = ({children, label, chapter, project}: {
    children: React.ReactNode;
    label: string;
    chapter: ChapterInterface;
    project: ProjectInterface;
}) => {

    // States
    const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);


    const [sectionOpen, setSectionOpen] = useState<boolean>(true)

    return (
        <div className={"flex w-full flex-col items-center mt-2"}>
            <div
                onClick={() => {
                    setSectionOpen(!sectionOpen)
                }}
                className={`max-w-260 flex w-full mb-4 flex h-12 justify-start justify-center ${sectionOpen ? 'block opacity-100 h-full' : 'h-12 bg-zinc-50 rounded-lg border border-zinc-300'}`}>
                {sectionOpen ?
                    <div onClick={() => setSectionOpen(!sectionOpen)}
                         className={`text-sm duration-300 transition w-10 h-8 flex items-center justify-center text-zinc-500 cursor-pointer`}>
                        <LiaAngleDoubleUpSolid/>
                    </div>
                    :
                    <div onClick={() => setSectionOpen(!sectionOpen)}
                         className={`text-sm duration-300 transition w-10 h-12 flex items-center justify-center text-zinc-500 cursor-pointer`}>
                        <LiaAngleDoubleDownSolid/>
                    </div>}
                <div
                    className={` ${sectionOpen ? 'w-full h-8 text-zinc-700' : 'h-12'} w-full transition-discrete duration-100 
                                    items-center flex cursor-pointer text-zinc-700 text-lg font-semibold`}>
                    {label.toUpperCase()}
                </div>
                <div
                    className={`items-center justify-center transition-all duration-300 ${!sectionOpen && "pr-2"} flex w-10`}>
                    <div className={"flex justify-end w-full cursor-pointer"}>
                        <div onClick={() => {
                            setIsCreateChapterOpen(true)

                        }}
                             className={"text-zinc-500 duration-100 hover:text-zinc-900"}>
                            <CiMenuKebab/>
                        </div>
                        <CreateChapterDialog chapter={chapter} project={project}
                                             isCreateChapterOpen={isCreateChapterOpen}
                                             setIsCreateChapterOpen={setIsCreateChapterOpen}/>
                    </div>
                </div>
            </div>
            <div
                className={`w-full  duration-300`}>

                {sectionOpen && <div
                    className="characters-section flex flex-col w-full h-full justify-start items-start">
                    {children}

                </div>}
            </div>
        </div>


    )
}

export default ChapterCollapseWrapper