import logo from '../../../assets/honeylogo.svg'
import { useContext, useState } from 'react'
import { AuthContext } from '../../services/auth-context'
import { Container } from './styles'

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [continued, setContinued] = useState(false)
    const [error, setError] = useState(false)
    const actx = useContext(AuthContext)

    // funcoes para mudar estado email e password respectivamente
    function emailHandler(e){
            setEmail(e.target.value)
    }

    function passwordHandler(e){
        setPassword(e.target.value)
    }

    // funcao para mudar de tela email -> senha
    function continueHandler(){
        if(email.includes('a')){
            setContinued(true)
        }
        else{
            setError(true)
            
        }
    }

    // funcao para voltar a tela email <- senha
    function backHandler(){
        setContinued(false)
    }

    // campo para digitar email
    if (!continued){
        return(
        <Container>
            <main className="login">
              
                <div className='login-section'>
                    <img alt='honey be logo' className='honey-logo' src={logo}/>
                    <h2>Olá, faça login.</h2>
                    <div className='login-form'>
                        <label className='input-label'>E-mail</label>
                        <input autoFocus={true} onKeyDown={(e)=>e.key==='Enter'?continueHandler():''} type={'email'} onChange={emailHandler}/>
                        {error?<label className='error-text'>Por favor, insira um e-mail válido</label>:<></>}
                        
                    </div>
    
                    <div onClick={continueHandler} className='continuar-button'>CONTINUAR</div>
                    
                    
                </div>
            </main>
        </Container>
        )
    }
    // campo para digitar senha (o true no onLogin() funciona como lembrar senha. caso false as credenciais sao salvas 
    // em session storage, sendo assim, quando o navegador for fechado essas credenciais sao redefinidas. caso true
    // as credenciais sao salvas no react-secure-storage e so podem ser deletados quando é feito logout)
    else{
        return(
            <Container>
            <main className="login">
                <div className='login-section'>
                    <img alt='honey be logo' className='honey-logo' src={logo}/>
                    <h2>{email}</h2>
                    <label onClick={backHandler} className='alterar-email'>Alterar email</label>
                    <div className='login-form'>
                        <label className='input-label'>Senha</label>
                        <input autoFocus={true} onKeyDown={(e)=>e.key==='Enter'?actx.onLogin(email, password, true):''} onChange={passwordHandler}/>
                    </div>
    
                    <div  onClick={()=>{actx.onLogin(email, password, true)}} className='continuar-button'>LOGIN</div>
                    
                    
                </div>
            </main>
            </Container>
        )
    }
    
}