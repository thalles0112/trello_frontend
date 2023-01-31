import { Container, BoardHeader } from "./styles"
import List from "../list"
import { useCallback, useEffect, useState } from "react"
import BoardContext from './context'
import { MdAdd, MdMoreVert } from 'react-icons/md'
import { editBoardTitle, getListById, getListsByBoardId } from "../services/requests"
import { useLocation } from "react-router-dom"
import { wsurl } from "../../backend"
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import CardPopup from "../card-popup"
import { putCardOnList } from "../services/requests"
import BoardOptions from "./board-options"
import produce from "immer"



export default function Board(){
    const [connectionStatus, setConnectionStatus] = useState(false)
    const [lists, setLists] = useState([])
    const [preview, setPreview] = useState(false)
    const [boardInfo, setBoardInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [boardTitle, setBoardTitle] = useState(boardInfo.title)
    const [options, setOptions] = useState(false)

    const route ={
        url_letter: useLocation().pathname.split('/')[1], 
        board_id: useLocation().pathname.split('/')[2],
        board_title: useLocation().pathname.split('/')[3]
    }

    // aqui serao feitas duas requests get: uma para pegar informacoes do quadro relativo a id da url atual /b/{id}/{titulo}
    // dentre essas informações estarão as listas vinculadas ao quadro no formato {id: 1, lists:[1,2,3,4,5...], .... } 
    // essa lista com os ids das listas será usada para fazer outra request: /api/lists/list_id=[1,2,3,4,5]

    useEffect(()=>{
        async function getLists(){
            const resp = await getListsByBoardId(route.board_id)
            setBoardInfo({'title':resp.title, 'id':resp.id, 'viewers':resp.viewers})
            getListById(resp.lists).then(res => setLists(res))
            setLoading(false)
        }
        if(route.url_letter === 'b'){
            setLoading(true)
            getLists()
        }
        
    },[route.url_letter, route.board_id])

    // toda vez que uma lista for criada essa funcao será executada  para mudar o estado lists
    // adicionando a lista recem criada e tambem a mensagem websocket sera enviada para atualizar
    // o quadro em tempo real para qualquer pessoa que esteja vendo o quadro
    const listSetter = (newlist, modifier) =>{
        if(!modifier){
            if (newlist){
                let newLists = ([...lists, ...newlist])
                setLists(newLists)
                setPreview(false)
            }
            else{
                setPreview(false)
            }
        }
        
        if (modifier){
            try{
                boardsWS.sendJsonMessage({'message':{'type':'add-list', 'modifier':true, 'list':newlist}})
            }
            catch (e){
                console.log(e)
            }
        }
    }
    

    // mesma logica dos listas quando sao adicionadas, com a diferenca que a mensagem websocket
    // é enviada diretamente  no componente da lista sem nenhum motivo especifico
    const cardAdder = (card, listId, modifier) =>{
        if(!modifier){
            const nextState = produce(lists, draft =>{
                draft.map(list=>{
                    if (list.id == listId){
                        list.cards.push(card)
                    }
                })
    
            })
            setLists(nextState)
        }
 
    }


    
    const boardsWS = useWebSocket(`${wsurl}/ws/board/${boardInfo.id}/`)
    
    const sendRequests = (data)=>{
        async function send(){
            try{
                await putCardOnList(data)
                
            }
            catch{
                console.log('erro no put')
            }
        }
        send()
    }


    // funcao responsavel por renderizar a mudança de posição do card, enviar request put para o backend
    // removendo o card da lista anterior e colocando esse mesmo card na lista que foi soltado
    //e mensagem websocket 

    function move(fromList, toList, from, to, modifier, type){
        if (!modifier){
            
            // copia temporaria de todas as listas
            let copyList = [...lists]
            const dragged = copyList[fromList].cards[from]

            // datinha é uma variavel simples apenas com o intuito de pegar o estado da lista antes e depois do card ser movido
            // aqui datinha pega o valor inicial de lists, remove o card que foi movido e informa ao backend todos os cards que
            // sobraram na lista
            let datinha = {
                'cards':copyList[toList].cards.length>0?[...copyList[toList].cards.map(card=>{return(card.id)}), dragged.id]:[dragged.id], 
                'listId':copyList[toList].id, 
                'listTitle':copyList[toList].title
                }
            sendRequests(datinha)

            // aqui o estado das listas sendo renderizadas é alterado conforme o card é movido
            const nextState = produce(lists, draft=>{
                draft[fromList].cards.splice(from, 1)
                draft[toList].cards.splice(to, 0, dragged) 
            })

            setLists(nextState)

            // criada uma outra copia de todas as listas, mas agora apos o card ter sido movido
            copyList = nextState

            // enviado para o backend a instrução de adicionar o card na lista
            datinha = {
                'cards':copyList[fromList].cards.map(card=>{return(card.id)}), 
                'listId':copyList[fromList].id, 
                'listTitle':copyList[fromList].title
                }

            sendRequests(datinha)
            }
      

        if(modifier){
            boardsWS.sendJsonMessage({'message': {fromList, toList, from, to,  'modifier':true, 'type':'move-card'}}) 
            }           
        }
        
        // possiveis comandos para serem executados por mensagens websocket
        const commands = {'move-card': move, 
                          'add-list': listSetter,
                          'add-card': cardAdder
                        }

        const wsConnection = useWebSocket(`${wsurl}/ws/board/${route.board_id}/`, {

            onOpen: ()=>{
                setConnectionStatus(true)
            },
            onClose:()=>{
                setConnectionStatus(false)
            },

            // aqui quando as mensagens websocket chegam determinados comandos sao executados como criar lista, criar card e mover card
            onMessage: (e)=>{
                const data = JSON.parse(e.data)
              
                switch(data.message){
                    default:
                        
                        
                        break
                    case (data.message):
                        
                        if (data.message.modifier){

                            if(data.message['type'] == 'move-card'){
                                try{
                                commands['move-card'](data.message.fromList, data.message.toList, data.message.from, data.message.to, false)
                                }catch{

                                }
                            }
                            else if(data.message['type'] == 'add-list'){
                                commands['add-list'](data.message.list, false)
                            }
                            else if(data.message['type'] == 'add-card'){
                                commands['add-card'](data.message.card, data.message.listId, false )
                            }
                            
                        }   
                    }
                }
            }
        )
    
        
    
    const blurHandler=useCallback(async()=>{
      
        if(boardTitle || boardTitle != ''){
            await editBoardTitle(boardInfo.id, boardTitle)
        }
        
    }, [boardTitle, boardInfo.id])

    
    

    const addListHandler=()=>{
        setPreview(true)
    }


        

    if (!loading){
    return(
        <BoardContext.Provider value={{ lists, move, boardInfo, boardsWS, wsConnection }}>
            {options?<BoardOptions boardTitle={boardInfo.title} boardId={boardInfo.id} viewers={boardInfo.viewers}/>:<></>}
            <BoardHeader>
            <head>
                <title>HoneyBe | {boardInfo.title}</title>
            </head>

            <span className="connection-status" style={{backgroundColor: connectionStatus?'green':'red'}}></span>
            <input 
                    className="board-title" 
                    onChange={(e)=>{setBoardTitle(e.target.value)}} 
                    defaultValue={boardInfo.title} 
                    value={boardTitle}
                    onBlur={blurHandler}
                    />
            
            {
                route.url_letter==='b'?
                <></>
                :
                <CardPopup/>
            }
                <div>
                     <span onClick={()=>options?setOptions(false):setOptions(true)}> <MdMoreVert size={18}/>Opções do quadro</span>
                </div>
                </BoardHeader>
            
            <Container>
                
                
                <div className="scroll-horizontal-list">
                    {lists && lists.map((list, index) =>{
                        return(
                        
                        <List boardId={route.board_id} key={list.id} data={list} index={index} listId={list.id} preview={false} />
                        
                        )
                    })} 
                {preview?
                <List boardId={route.board_id} title={''} index={0} listId={'xyz'} data={{'cards':[]}} preview={preview} listSetter={listSetter} boardInfo={boardInfo} />
                :
                null
                }
                
                <button onClick={addListHandler} id='add-list-button'>
                    <MdAdd size={100} color={'#fff'}/>
                    Adicionar Lista
                </button>
                </div>  
                
            </Container>
            
        </BoardContext.Provider>
    )
    }
    else{
        return(
            <div>Carregando</div>
        )
    }
}