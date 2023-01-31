import { Container } from "./styles"
import { useContext, useEffect, useState } from "react"
import { getBoards } from "../../services/requests"
import { Link } from "react-router-dom"
import { MdAdd } from "react-icons/md"
import { postBoard } from "../../services/requests"
import { removeSpaces } from "../../services/utils"
import { AuthContext } from "../../services/auth-context"

export default function Home(){
    const [boards, setBoards] = useState([]) // lista de boards disponiveis
    const [previewBoard, setPreviewBoard] = useState(false) // estado que diz se o campo de digitar o nome de um novo quadro esta visivel ou nao
    const [boardTitle, setBoardTitle] = useState('') // titulo do quadro sendo editado
    const auth_context = useContext(AuthContext) // auth context
   
    // faz o GET dos quadros disponíveis para o usuario logado
    useEffect(()=>{
        async function getData(){
            const resp = await getBoards(auth_context.profileId)

            setBoards(resp)
        }
        getData()
    },[auth_context.profileId])

    //  muda o estad title do quadro sendo editado
    const boardTitleChange=(e)=>{
        setBoardTitle(e.target.value)
    }

    // quando o input do quadro sendo editado sai de foco essa funcao e executada para postar o quadro no BD
    async function postBoardHandler(){
        if (boardTitle !== ''){
            const resp = await postBoard(boardTitle, auth_context.profileId)
            setBoards([...boards, resp])
        }
        setPreviewBoard(false)
    }


    return(
        <Container>
            <main>
                

                <header>
                    <h2>Seus quadros</h2>
                </header>

                <section>
                    
                    {boards.map(board=>{
                        return(
                        <Link className="board-thumb" key={board.id} to={`b/${board.id}/${removeSpaces(board.title)}`}>
                            <div className="boards-list">
                            <h3>{board.title}</h3>
                            </div>
                        </Link>
                        )
                    })}
                    {previewBoard?
                        <div className="preview-board">
                            <input 
                                autoFocus={true} 
                                onBlur={postBoardHandler} 
                                onChange={boardTitleChange} 
                                placeholder="Título do quadro"
                                />
                        </div>
                        :
                        <></>
                        }
                        <button onClick={()=>{setPreviewBoard(true)}} className="add-board">
                            <MdAdd size={'84px'}/>
                            Criar quadro
                        </button>
                </section>
            </main>
        </Container>
    )
}