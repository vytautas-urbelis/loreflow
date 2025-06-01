import {Outlet} from "react-router"

const Layout = () => {
    return (
        <>
            <div className=" items-center w-full h-fit min-h-screen ">

                <Outlet/>

            </div>
        </>
    )
}

export default Layout
