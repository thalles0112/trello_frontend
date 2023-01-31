import {url} from '../../backend'
import { status } from './utils'

// GET

export function getBoards(user_profile){
    'user_profile = integer'
    try{
        return fetch(`${url}/api/custom-boards/?profile_id=${user_profile}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
        console.log('error on getBoards', e)
    }
}


export function getListsByBoardId(id){
    'id = integer'
    try{
        return fetch(`${url}/api/boards/${id}/`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
        console.log('error on getBoards', e)
    }
}

export function getListById(ids){
    'ids = array[1,2,3,4,5]'
    try{
        return fetch(`${url}/api/lists/?list_id=${ids}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
        console.log('error on getListById', e)
    }
}

export function getCard(id){
    'id = integer'
    try{
        return fetch(`${url}/api/cards/${id}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
       
    }
}

export function getProfiles(){
    try{
        return fetch(`${url}/api/profiles`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
        console.log('error on getListById', e)
    }
}


export function getCommentByCardId(cardId){
    try{
        return fetch(`${url}/api/comentarios/?card=${cardId}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json())
    }
    catch (e){
        console.log('error on getListById', e)
    }
}










// POST

export async function auth(credentials){
    'credentials = object {email: string, password: string}'
    return fetch(`${url}/api/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(status).catch(() => {window.alert('Usuário ou senha incorreto(os)')})
  }

export function postCard(cardTitle, card_index){
    'cardTitle = string, card_index = integer'
    return fetch(`${url}/api/cards/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'title':cardTitle, 'card_index':card_index})
      }).then(status).catch()
}


export function postList({title, cards}){
    '{title:string, cards:array[1,2,3,4,5]}'
    return fetch(`${url}/api/basic_lists/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'title':title, 'cards':cards})
        }).then(status).catch()
}

export function postBoard(title, profile_id){
    return fetch(`${url}/api/boards/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'title':title, 'viewers':[profile_id]})
        }).then(status).catch()
}

export function postComment(cardId, text, userProfile){
    return fetch(`${url}/api/comentarios/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'card':cardId, 'text':text, 'user': userProfile})
        }).then(status).catch()
}









// PUT

export function putCardOnList(data){
    '{listId: integer, listTitle: string, cards: array[1,2,3,4,5] }'
    return fetch(`${url}/api/basic_lists/${data.listId}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": data.listTitle,
            "cards":data.cards
        })
    }).then(status).catch()
}


export function editCard(cardTitle, cardId, cardIndex){
    'cardTitle= string, cardId= integer, cardIndex= integer'
    return fetch(`${url}/api/cards/${cardId}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": cardTitle,
            "card_index": cardIndex
            
        })
    }).then(status).catch(e=>{console.log(e)})
}

export function editListTitle(id, title){
    'id= integer, title= string'
    return fetch(`${url}/api/basic_lists/${id}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": title,

        })
    }).then(status).catch(e=>{console.log(e)})
}

export function putListOnBoard(data){
    '{id: integer, title: string, lists: array:[1,2,3,4,5]}'
    return fetch(`${url}/api/boards/${data.id}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": data.title,
            "lists": data.lists,
            
        })
    }).then(status).catch(e=>{console.log(e)})
}

export function editBoardTitle(id, title){
    'id= integer, title= string'
    return fetch(`${url}/api/boards/${id}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": title
        })
    }).then(status).catch(e=>{console.log(e)})
}

export function editCardDescription(cardId, cardDesc, cardTitle){
    'cardId= integer, cardDesc= string, cardTitle= string'
    return fetch(`${url}/api/cards/${cardId}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": cardTitle,
            "description": cardDesc
            
        })
    }).then(status).catch(e=>{console.log(e)})
}

export function editCardViewers(boardId, viewers, boardTitle){
    'boardId= integer, viewers= array[1,2,3,4,5], boardTitle= string'
    return fetch(`${url}/api/cards/${boardId}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'title': boardTitle,
            'viewers':viewers
            
        })
    }).then(status).catch(e=>{console.log(e)})
}

export function editBoardViewers(boardId, viewers, boardTitle){
    'boardId= integer, viewers= array[1,2,3,4,5], boardTitle= string'
    return fetch(`${url}/api/boards/${boardId}/`,{
        method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'title': boardTitle,
            'viewers':viewers
            
        })
    }).then(status).catch(e=>{console.log(e)})
}










// DELETE

export function deleteList(id){
    'id= integer'
    return fetch(`${url}/api/basic_lists/${id}/`,{
        method: 'DELETE',
        headers:{
            "Content-Type": "application/json"
        }
        
    })
}












export function deleteEveryThingHahahaha(){
    try{
        fetch(`${url}/api/boards`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json().then(boards=>{boards>1?boards.map(board=>fetch(`${url}/api/boards/${board.id}/`, {method: 'delete'})):console.log('')}))
    }
    catch (e){
        console.log('error on getBoards', e)
    }

    try{
        fetch(`${url}/api/basic_lists/`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json().then(lists=>{lists.length>1?lists.map(list=>fetch(`${url}/api/basic_lists/${list.id}/`, {method: 'delete'})):console.log('')})).catch(e=>console.log(e))
    }
    catch (e){
        console.log('error on getBoards', e)
    }

    try{
        return fetch(`${url}/api/cards`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        }).then(resp=>resp.json().then(cards=>{cards.length>1?cards.map(card=>fetch(`${url}/api/cards/${card.id}/`, {method: 'delete'})):console.log('')})).catch
    }
    catch (e){
        console.log('error on getBoards', e)
    }
}
