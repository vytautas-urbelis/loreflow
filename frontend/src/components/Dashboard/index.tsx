import CreateProjectDialog from "./Dialogs/CreateProjectDialog";
import {useState} from "react";
import NavBar from "./Project/NavigationBar";


const DashboardHome = () => {
    // states management
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)


    return (
        <main
            className={"characters-section flex w-full h-screen justify-center items-center "}>
            <NavBar/>
            <section className={"w-60 shrink-0 h-full p-3 gap-3 hidden md:hidden lg:block"}>
            </section>
            {/*<div className={"flex w-full h-full items-center justify-center"}>*/}
            {/*    <div>*/}

            {/*        <div*/}
            {/*            onClick={() => setIsCreateProjectOpen(true)}*/}
            {/*            className={"h-60 w-60 bg-zinc-50 rounded-2xl flex flex-col justify-center items-center border-zinc-200  border-4"}>*/}
            {/*            <p className={"text-zinc-600 mb-2"}>Create new project</p>*/}
            {/*            <div className={"text-6xl p-5 text-zinc-500 border-4 border-gray-100 rounded-2xl"}>*/}
            {/*                <MdOutlinePostAdd/></div>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</div>*/}
            <CreateProjectDialog setIsCreateProjectOpen={setIsCreateProjectOpen}
                                 isCreateProjectOpen={isCreateProjectOpen}/>

        </main>

    )
}
export default DashboardHome
