import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"

import Home from "../components/views/home"
import Board from "../components/board"



export const auth_routes = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route errorElement={<Home/>} path="/" element={<Home/>}/>
        <Route path="/b/:id/:boardtitle" element={<Board/>}/>
        <Route path="/c/:id/:cardtitle" element={<Board/>}/>
        
        </>
    )
)