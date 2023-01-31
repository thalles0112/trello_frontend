import { Container } from "./styles"
import { postCard } from "../services/requests"
import { putCardOnList } from "../services/requests"

import { useDrag, useDrop } from "react-dnd"
import { useRef, useContext, useCallback, useState } from "react"
import BoardContext from '../board/context'
import { MdEdit } from 'react-icons/md'
import { Link } from "react-router-dom"
import { removeSpaces } from "../services/utils" // funcao para formatar url tirando espacos e colocando -

export default function Card({data, // todos os dados do card
                              index, // index do card na lista
                              listIndex, // index da lista em que o card esta
                              id,  // id do card
                              max_index, // ultimo index da lista
                              card_index, // index do card vindo do backend
                              invisible, // usado somente no card virtual no inicio da lista. sem esse card virtual nao é possivel mover cards para listas vazias
                              editing, // se editing == true quer dizer que há um novo card sendo criado
                              listId, // id da lista em que o card se encontra
                              listTitle, // titulo da lista em que o card se encontra
                              cardSetter, // funcao para adicionar o card à lista imediatamente após ser criado
                              cards_id}){ // lista de cards, mas so com os id's
    const cardRef = useRef()
    const {move} = useContext(BoardContext)
    
    const [cardTitle, setCardTitle] = useState('') // estado para acompanhar o titulo do card sendo criado
    
    
    
    const [{isDragging}, dragRef] = useDrag({
        type: 'CARD',
        item: {type: 'CARD',  index, listIndex, id},
        collect: (monitor) =>({
            isDragging: monitor.isDragging(),
            offset: moveHandler(monitor.getClientOffset()) // distancia do card de sua posicao inicial. é usada para fazer scrollX automaticamente ao arrastar
        })
        
    }
    );
   
    // funcao para fazer scrollLeft baseado na posicao do card sendo arrastado.
    function moveHandler(offset){ 
        let window_ = window.innerWidth

        try{
            let windowPercentage = (offset.x * 100)/window_

            if (windowPercentage > 75){
                let scrollList = document.querySelector('.scroll-horizontal-list')
                scrollList.scrollLeft += 1

            }
            else if (windowPercentage < 20){
                let scrollList = document.querySelector('.scroll-horizontal-list')
                scrollList.scrollLeft -= 1
            }
        }
        catch{

        }
   
        
        try{
        if (isDragging){
            let windowPercentage = (offset.x * 100)/window_
            
            
            if (windowPercentage > 75){
                let scrollList = document.querySelector('.scroll-horizontal-list')
                scrollList.scrollLeft += 1
            }

            else if (windowPercentage < 20){
                let scrollList = document.querySelector('.scroll-horizontal-list')
                scrollList.scrollLeft -= 1
            }
        
            
            let element = document.getElementById(cardRef.current.id)
            element.style.left = `${offset.x}px`
            element.style.top = `${offset.y}px`

            
        }
    }
    catch (e){
        
    }
    }
    

    let draggedListIndex
    let targetListIndex 
    
    let draggedIndex
    let targetIndex

    


    const [, dropRef] = useDrop({
        accept: 'CARD',
        

        hover(item, monitor) {
            draggedListIndex = item.listIndex
            targetListIndex = listIndex
            
            draggedIndex = item.index;
            targetIndex = index;

            
           
      
            if(draggedIndex === targetIndex && draggedListIndex === targetListIndex){
                return;
            }

            // aqui sao executados os calculos para saber o tamanho de um card e definir a posição
            // no documento e definir também se o card sendo arrastado está em baixo ou em cima do
            // card que está por baixo.
            const targetSize = cardRef.current.getBoundingClientRect()
            const targetCenter = (targetSize.bottom - targetSize.top) /2

            const draggedOffset = monitor.getClientOffset()
            const draggedTop = draggedOffset.y - targetSize.top
        
            if (draggedIndex < targetIndex && draggedTop < targetCenter){
                return
            }

            else if (draggedIndex > targetIndex && draggedTop > targetCenter){
                return
            }


        },

     
        // assim que o card for droppado a funcao move que está em /board/index.js sera executada e entao
        // o estado principal que renderiza todas as listas e cards será alterado conforme o card for colocado
        // e dentro da funcao move será enviado uma mensagem por websocket para todos os usuarios que 
        // estiverem vendo o quadro em questao essa mensagem ira executar a funcao move() da mesma forma que 
        // foi executada no cliente de origem.
        
        // para evitar um loop infinito de mensagens é adicionado o argumento modifier. caso true a funcao
        // move ira mandar a mensagem websocket e fará a modificação na lista localmente. caso false sera feito
        // o contrario. nao ira mandar mensagem, mas ira alterar a lista localmente.

        drop(item, monitor){
          
            if (item.id !== undefined ){
                
                move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, true, 'move-card')
              
                item.index = targetIndex
                item.listIndex = targetListIndex;
              
            }
        },
    });

    // funcao para acompanhar a edicao do titulo do card
    const editTextHandler =(e)=>{
        setCardTitle(e.target.value)
    }

    // assim que o input perder o foco o card será postado e colocado na lista em que foi criado
    // também sera enviada uma mensagem websocket para as pessoas que estiverem no quadro com a mesma
    // logica de mover um card. 
    const blurHandler = useCallback(async()=>{
        if (cardTitle || cardTitle != ''){
            const resp = await postCard(cardTitle, max_index)
        
            cardSetter(resp, false)
            await putCardOnList({'cards':[...cards_id, resp.id], 'listId':listId, 'listTitle':listTitle})
        }

        else{
            cardSetter(false, false)
        }

        
        
        
    },[ cardSetter, cardTitle, cards_id, listId, listTitle ])

    function clickPropagationStoper(e){
        if (!e) e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }


    dragRef(dropRef(cardRef))

    if (!invisible){
        if (!editing){
            return(
                
                <Container 
                    onContextMenu={(e)=>{e.preventDefault()}} 
                    onClick={clickPropagationStoper} 
                    ref={cardRef} 
                    id={`card-${id}`}
                    isDragging={isDragging} 
                    
                    >

                    
                    <div className="card">
                       <Link to={`/c/${data.id}/${removeSpaces(data.title)}/`}  >
                            <header>
                            
                            </header>
                        
                            {editing?
                                <input autoFocus={true}/>
                                :
                                <p>{data.title}</p>
                            }
                            
                        </Link>
                        
                        <button className="edit-card-button">
                            <MdEdit size={18} color='#fff'/>
                        </button>
                        
                    </div> 
                    
                </Container>
                
            )}
        
    
    else{
        
        return(
            <Container 
            onContextMenu={(e)=>{e.preventDefault()}} 
            onClick={clickPropagationStoper} 
            ref={cardRef} 
            id={`card-${id}`}
            isDragging={isDragging} 
            
            >

            
               <div className="card">
               
                <header>
                   
                </header>
                
                <input onBlur={blurHandler} onChange={editTextHandler} autoFocus={true}/>
                    <button className="edit-card-button">
                        <MdEdit size={18} color='#fff'/>
                    </button>
                </div> 
            
        </Container>
            )
        }
    }

 
    
    else{
        return(
            <div  ref={cardRef} style={{opacity:0, height: '50px'}} >_
            
            
            
            
            </div>
        )
    }
}