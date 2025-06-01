import useAuthStore from "../zustand/AuthStore.tsx";
import {Navigate, Outlet} from "react-router";

const ProtectedRoutes = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    return (
        <>
            {isLoggedIn ? <Outlet /> : <Navigate to="/" />}
        </>
    )
}

export default ProtectedRoutes;