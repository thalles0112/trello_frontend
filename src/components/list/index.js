import { Container } from "./styles"
import { MdAdd, MdMoreHoriz, MdDelete  } from 'react-icons/md'
import Card from "../card"
import { useCallback, useContext, useState } from "react"
import { postList, putListOnBoard, editListTitle, deleteList } from "../services/requests"
import BoardContext from '../board/context'
import { getListById } from "../services/requests"

 
export default function List({data, index: listIndex, listId, preview, boardInfo, listSetter}){
    const [editingNewCard, setEditingNewCard] = useState(false)
    const [listTitle, setListTitle] = useState(data.title)
    const {lists, boardsWS } = useContext( BoardContext )
    const [cardsId, setCardsId] = useState(data.cards.map(card=>{return(card.id)}))
    
    
    const listTitleChangeHandler=(e)=>{
        setListTitle(e.target.value)
    }

    const blurHandler = useCallback(async() =>{
        console.log(listTitle)
       
        
       
        if (listTitle !== undefined){
            console.log('teste')
            let resp = await postList({'title': listTitle, 'cards':[]})
            let createdList = await getListById([resp.id])
            
            listSetter(createdList, true)
            await putListOnBoard({'id': boardInfo.id, 'title': boardInfo.title, 'lists':[...lists.map(list=>{return list.id}), resp.id]})
           
        }
        else{
            listSetter(false)
        }
        
    },[listTitle, boardInfo, listSetter, lists])
    

    const cardSetter = (newCard, modifier) => {
            
            if(newCard){
                if(modifier){
                    let newCards = [...data.cards, newCard]
                    
                   
                    data.cards.push(newCard)
                    setEditingNewCard(false)
                    let newCardsId  = []
                    try{
                        newCards.map(card=>newCardsId.push(card.id))
                        setCardsId(newCardsId)
                    }
                    catch{
                        console.log('erro ao setar ids')
                    }
                }
            boardsWS.sendJsonMessage({'message':{'card': newCard, 'listId':data.id, 'type':'add-card', 'modifier': true}})
            }

            else{
                setEditingNewCard(false)
            }
            setEditingNewCard(false)
        
    }

    const listTitleChanger=useCallback(async()=>{
        await editListTitle(data.id, listTitle)
    }, [listTitle, data.id])

    

    
    return (
        <Container >
            <header>
                {!preview?
                <input onChange={listTitleChangeHandler} onBlur={listTitleChanger} className="list-title" value={listTitle}/>
                :
                <h2>
                    <input onChange={listTitleChangeHandler} onBlur={blurHandler} autoFocus={true} placeholder="Título da lista"/>
                </h2>
                }

                {!preview?
                    <button onClick={()=>setEditingNewCard(true)} type="button">
                        <MdAdd size={24} color='#fff'/>
                    </button>
                :
                null
                }

                <button onClick={async()=>await deleteList(data.id)} type="button">
                    <MdDelete size={24} color='#fff'/>
                </button>
                
            </header>

            <ul>
                
                <Card invisible={true} key={'y9x'} data index={1} listIndex={listIndex} title={'_'}/>
                
                {data.cards && data.cards.map((card, index)=>{
                     
                        return(
                            <Card 
                                cards_id={cardsId}
                                key={card.id} 
                                data={card} 
                                listIndex={listIndex}
                                index={index}
                                card_index={card.card_index}
                                max_index={data.cards.length}
                                title={card.title}
                                id={card.id}
                                listId={listId}
                                cardSetter={cardSetter}
                            />
                        )
                    
                    })
                }
                {editingNewCard?<Card max_index={data.cards.length} title={''} listIndex={listIndex} editing={editingNewCard} listId={listId} listTitle={listTitle} cards_id={cardsId} cardSetter={cardSetter}/>:<></>}
                
            </ul>
        </Container>
    )
}