import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"


import Login from "../components/views/login"


export const no_auth_routes = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route errorElement={<Login/>}/>
        <Route  path="/login" element={<Login/>}/>
        </>
    )
)