import { createContext, useEffect, useState } from "react";
import secureLocalStorage from 'react-secure-storage'
import { auth } from "../services/requests";

export const AuthContext = createContext({
    user:null,
    id:null,
    profileId:null,
    onLogin:(username, password, remember)=>{return(submitHandler(username, password, remember))},
    onLogout:()=>{logoutHandler()},
    isLogged: Boolean,
    userPicture: null,
    premium: null
})


const submitHandler=async (username, password, remember)=>{
    
    const userData = await auth({'username':username, 'password':password})
    console.log(userData)
        if(remember){
            try{
            console.log('guardando dados em storage')
            secureLocalStorage.setItem('trellobet', userData.token)
            secureLocalStorage.setItem('trellobeun', String(userData.user.username))
            secureLocalStorage.setItem('trellobeuid', String(userData.user.id))
            secureLocalStorage.setItem('trellobepid', String(userData.user.profile.id))
            secureLocalStorage.setItem('trellobeupi', String(userData.user.profile.picture))
            }catch{

            }
        }
 
        else{
            try{

            
            console.log('guardando dados em sessao')
            window.sessionStorage.setItem('trellobet', userData.token)
            window.sessionStorage.setItem('trellobeun', userData.user.username)
            window.sessionStorage.setItem('trellobeuid', String(userData.user.id))
            window.sessionStorage.setItem('trellobepid', String(userData.user.profile.id))
            window.sessionStorage.setItem('trellobeupi', String(userData.user.profile.picture))
            }catch{

            }

        }
       window.location.reload(false)
        
    }

    async function logoutHandler(){
        
        
            secureLocalStorage.removeItem('trellobet')
            secureLocalStorage.removeItem('trellobeun')
            secureLocalStorage.removeItem('trellobeuid')
            secureLocalStorage.removeItem('trellobepid')
            secureLocalStorage.removeItem('trellobeupi')
            
            

            window.sessionStorage.removeItem('trellobet')
            window.sessionStorage.removeItem('trellobeun')
            window.sessionStorage.removeItem('trellobeuid')
            window.sessionStorage.removeItem('trellobepid')
            window.sessionStorage.removeItem('trellobeupi')
          
            
            window.location.reload(false)
        
        }

export const AuthProvider=({children})=>{
    const [userId, setUserId] = useState(null)
    const [profileId, setProfileId] = useState(null)
    const [token, setToken] = useState(null)
    const [userName, setUsername] = useState(null)
    const [isLogged, setLogged] = useState(false)
    const [isPremium, setPremium] = useState(null)
    const [userPicture, setUserPicture] = useState(null)

    useEffect(()=>{
        const getData = ()=>{
            

            let _token = secureLocalStorage.getItem('trellobet')
            let _username = secureLocalStorage.getItem('trellobeun')
            let _userid = secureLocalStorage.getItem('trellobeuid')
            let _profileid = secureLocalStorage.getItem('trellobepid')
            let _userpicture = secureLocalStorage.getItem('trellobeupi')
            
            

        
            if (_token == null){
            _token =  window.sessionStorage.getItem('trellobet')
            _username = window.sessionStorage.getItem('trellobeun')
            _userid = window.sessionStorage.getItem('trellobeuid')
            _profileid = window.sessionStorage.getItem('trellobepid')
            _userpicture = window.sessionStorage.getItem('trellobeupi')
           
            
        }

        if(_token){
            setLogged(true)
            setToken(_token)
            setUsername(_username)
            setUserId(_userid)
            setProfileId(_profileid)
            setUserPicture(_userpicture)
       
            }
            else{
            setLogged(false)
            setToken(null)
            setUsername(null)
            setUserId(null)
            setProfileId(null)
            setUserPicture(null)
            }

    }
    getData()

    }, [token])
    

    
    return (
        <AuthContext.Provider value={{user:userName, onLogin:submitHandler, onLogout:logoutHandler, isLogged:isLogged, id:userId, profileId:profileId, userPicture:userPicture, token:token, premium:isPremium}}>
          {children}
        </AuthContext.Provider>
      )
}