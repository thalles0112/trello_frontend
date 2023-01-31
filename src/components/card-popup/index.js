import { useCallback, useContext } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import {  getCard, getCommentByCardId, getProfiles, postComment } from "../services/requests"
import { Container } from "./styles"
import RichTextExample from "./richTextEditor"
import {AuthContext} from '../services/auth-context'
import MentionExample from "./mentions"
import { GrTextAlignLeft, GrAttachment } from 'react-icons/gr'
// Import the Slate editor factory.



export default function CardPopup(){
    const cardId = useLocation().pathname.split('/')[2]
    const [card, setCard] = useState([])
    const [profiles, setProfiles] = useState([])
    const [comentarios, setComentarios] = useState([])
    const auth_context = useContext(AuthContext)
    const [loading, setLoading] = useState({description:null, profiles: null, comments:null})
    
    
    useEffect(()=>{
        async function getCardInfo(){
                const resp = await getCard(cardId)
                setCard(resp)  
                setLoading({...loading, description:false})
        }
        setLoading({...loading, description:true})
         getCardInfo()

    },[cardId])
    
    useEffect(()=>{
        async function getComment(){
                const resp = await getCommentByCardId(cardId)
                setComentarios(resp)
                setLoading({...loading, comments:false})
        }
        setLoading({...loading, comments:true})
        getComment()

    },[cardId])
    
    useEffect(()=>{
        async function retrieveProfiles(){
                const resp = await getProfiles()
                setProfiles(resp)
                setLoading({...loading, profiles:false})
        }
        setLoading({...loading, profiles:true})
        retrieveProfiles()

    },[])

   
    
    const saveComment = useCallback(async()=>{
        const newComment = await postComment(card.id, document.querySelector('.insert-comment--input').textContent, auth_context.profileId)
        document.querySelector('.insert-comment--input').textContent = ''
        setComentarios([ newComment, ...comentarios])
    },[card.id, auth_context.profileId, comentarios])


    return(
        
        <Container>
            <main>
                <header>
                    <h1>{card.title}</h1>
                </header>

                <span><GrTextAlignLeft/> Descrição</span>
                <section className="text-editor">
                    {loading.description
                        ?<></>
                        :<RichTextExample card={card}/>
                    }
                    
                 
                </section>

                <span><GrAttachment/> Anexos</span>
                <section>

                </section>

                <span>@ Menções</span>
                <section className="text-editor mention">
                    {loading.profiles
                        ?<></>
                        :<MentionExample profiles={profiles} card={card}/>
                    }
                
              
                   
                </section>
              
                {!loading.comments
                ?<section className="comentarios">
                    Comentarios
                    <div>
                        
                        <div className="comment new">
                            <div className="comment-data">
                                <div className="user-picture">
                                    {auth_context.user[0].toUpperCase()}{auth_context.user[2].toUpperCase()}
                                </div>
                                    
                                    <div contentEditable suppressContentEditableWarning={true} className="insert-comment--input"/>
                                    
                            </div>
                            <button onClick={saveComment} className="save-comment">salvar</button>
                        </div>
                        
                        
                        <ul className="scroll-list">
                            {comentarios && comentarios.map((comentario, idx)=>{
                                return(
                                    <div key={idx} className="comment">
                                        <div className="user-picture">
                                            {comentario.return_user[0]}{comentario.return_user[2].toUpperCase()}
                                        </div>
                                        <div className='comment-content'>
                                            <p className="user-name">{comentario.return_user}</p>
                                            <p>{comentario.text}</p>
                                            <p className="date">{new Date(Date.parse(comentario.date)).toLocaleDateString('pt-BR')} - {new Date(Date.parse(comentario.date)).toTimeString().slice(0, 5)}</p>
                                        </div>
                                        
                                    </div>
                                )
                            })}
                        </ul>
                    </div>
                </section>
                :<></>
                }
            </main>
        </Container>
        
        
    )
    
}