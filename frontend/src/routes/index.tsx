import {BrowserRouter, Route, Routes} from "react-router"
import Layout from "./Layout"
import NotFound from "./NotFound"
import DashboardRoute from "./DashboardHome"
import DashboardLayout from "./DashboardLayout";
import DashboardProjectRoute from "./Project";
import HomeRoute from "./Home";
import ProtectedRoutes from "../utils/ProtectedRoutes.tsx";

export default function Router() {
    return (
        <BrowserRouter>

            <Routes>
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<DashboardLayout/>}>
                        <Route path="/dashboard" element={<DashboardRoute/>}/>
                        <Route path="/dashboard/project/:id" element={<DashboardProjectRoute/>}/>
                    </Route>
                </Route>
                <Route element={<Layout/>}>
                    {/*<Route path="/" element={<Home />} />*/}
                    <Route path="/" element={<HomeRoute/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}
