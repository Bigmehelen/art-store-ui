import {createBrowserRouter} from "react-router";
import Gallery from "../pages/Gallery";
import Register from "../auth/register";
import Login from "../auth/login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Gallery />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {    
        path: "/login",
        element: <Login />,
    },
])

export default router
