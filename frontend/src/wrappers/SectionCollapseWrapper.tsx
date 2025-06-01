import {useState} from 'react'
import {LiaAngleDoubleDownSolid, LiaAngleDoubleUpSolid} from "react-icons/lia";


const SectionCollapseWrapper = ({children, label}: {
    children: React.ReactNode;
    label: string;
}) => {

    const [sectionOpen, setSectionOpen] = useState<boolean>(false)

    return (
        <div className={"flex w-full flex-col"}>
            <div onClick={() => {
                setSectionOpen(!sectionOpen)
            }}
                 className={` flex w-full h-8 justify-center ${sectionOpen ? 'block opacity-100 h-full' : 'h-8 bg-zinc-50 rounded-lg'}`}>
                {sectionOpen ?
                    <div
                        className={`text-sm duration-300 transition w-8 h-8 flex items-center justify-center text-zinc-500 cursor-pointer`}>
                        <LiaAngleDoubleUpSolid/>
                    </div>
                    :
                    <div
                        className={`text-sm duration-300 transition w-8 h-8 flex items-center justify-center text-zinc-500 cursor-pointer`}>
                        <LiaAngleDoubleDownSolid/>
                    </div>}
                <div onClick={() => setSectionOpen(!sectionOpen)}
                     className={`w-full ${sectionOpen ? 'h-8 text-zinc-700' : 'h-8'} transition-discrete duration-100 
                                    items-center flex cursor-pointer text-zinc-500 text-sm`}>
                    {label}
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

export default SectionCollapseWrapper