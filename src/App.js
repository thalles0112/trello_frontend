import Header from "./components/header"
import GlobalStyle from './components/styles/global'
import { DndProvider } from "react-dnd"
//import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { RouterProvider } from "react-router-dom"
import { no_auth_routes } from "./routes/no-auth"
import { auth_routes } from "./routes/auth"
import { AuthContext } from "./components/services/auth-context"
import { useContext } from "react"

export default function App(){
  const auth_ctx = useContext(AuthContext)
  
  
  return (
    
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, enableTouchEvents: true, ignoreContextMenu: true, enableHoverOutsideTarget: true }}>
      
      <GlobalStyle/>
      <Header/>
      <RouterProvider router={auth_ctx.isLogged===true?auth_routes:no_auth_routes}/>
      
      </DndProvider>
    
  )
}