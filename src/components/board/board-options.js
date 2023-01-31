import { useState } from "react"
import { useCallback } from "react"
import { getProfiles } from "../services/requests"
import { Options } from "./styles"
import produce from "immer"
import { editBoardViewers } from "../services/requests"

export default function BoardOptions({boardTitle, viewers, boardId}){
    const [users, setUsers] = useState([])
    const [usersVisible, setUsersVisible] = useState(false)
    const [selectedProfiles, setSelectedProfiles] = useState(viewers)

    

    const profileGetter = useCallback(async()=>{
        if (!usersVisible){
            setUsersVisible(true)
            const profiles = await getProfiles()
            setUsers(profiles)
        }
        else{
            setUsersVisible(false)
        }
        
        
    })

    function clickPropagationStoper(e){
        if (!e) e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();   
    }

    const selectProfileHandler=async(id)=>{
        if (!selectedProfiles.includes(id)){
            const nextState = produce(selectedProfiles, draft=>{
                draft.push(id)
            })
            setSelectedProfiles(nextState)
            await editBoardViewers(boardId, nextState, boardTitle)
            console.log(nextState)
        }

        else{
            const nextState = produce(selectedProfiles, draft=>{
                draft.splice(selectedProfiles.indexOf(id),1)
            })
            setSelectedProfiles(nextState)
            await editBoardViewers(boardId, nextState, boardTitle)
            console.log(nextState)
        }
        
        
    }



    return(
        <Options>
            <ul className="options">
                <li onClick={(e)=>{profileGetter()}}>
                    Adicionar Pessoas
                    {usersVisible?
                    <ul className="sub-options">
                        {users.map(profile=>{
                            return(
                                <li className={`sub-option ${selectedProfiles.includes(profile.id)?'selected':''}`} onClick={(e)=>{clickPropagationStoper(e); selectProfileHandler(profile.id)}} key={profile.id}>
                                    {profile.name}
                                </li>
                            )
                            
                        })}
                    </ul>
                    :<></>}
                </li>
                <li>
                    Opção 1
                </li>
                <li>
                    Opção 1
                </li>
            </ul>
        </Options>
    )
}