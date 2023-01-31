import { Container } from "./styles"
import avatar from '../../assets/adorable-avatars.png'
import { AuthContext } from "../services/auth-context"
import { useContext } from "react"
import { deleteEveryThingHahahaha } from "../services/requests"
import { MdSearch } from "react-icons/md"
export default function Header(){
    const auth_ctx = useContext(AuthContext)

    const deleteHandler=()=>{
        async function foder(){
           await deleteEveryThingHahahaha()
           
        }

        foder()
    }

    return (
        <Container>
            <div className="main-header">
                <nav className="header-items">
                    <h1 className="header-logo">Honey <span id="hnb-square">Be</span></h1> 
                    <div id="atividades-text-under-logo">atividades</div>
                    <span className="nav-item">Automações</span>
                    <span className="nav-item">Quadro</span>
                    <span className="nav-item">Exemplo</span>
                    <span onClick={deleteHandler} className="apagar-tudo">Apagar tudo</span>
                </nav>

                
               
            
                
                <div className="search-and-profile">
                    <MdSearch size={34}/>
                    <div onClick={()=>{auth_ctx.onLogout()}} className="avatar-wrapper">
                        <img className="avatar" src={avatar}/>
                        <div id="">{auth_ctx.user}</div>
                    </div>
                </div>
            </div>
                
            
        </Container>
    )
}