import styled from "styled-components";

export const Container = styled.main`
.login{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    height: calc(100vh - 80px);
    background-color: white;
}

.login h2{
    font-weight: 400;
}


.login-section{
    border: 1px solid rgb(212, 212, 212);
    border-radius: 4px;
    padding: 15% 40px;
    display: flex;
    flex-direction: column;
    text-align: left;   
    box-shadow: 0 0 4px #c9c9c9;
}


.login .honey-logo{
    width: 50%;
    
}

.login-form{
    display: flex;
    flex-direction: column;
    
}

.input-label{
    color: gray
}

.login-form > input{
    border: 1px solid rgb(212, 212, 212);
    padding: 7px;
    border-radius: 4px;
}

.login-form > input:focus{
    outline: 1px solid rgb(185, 185, 185);    
}

.login-section .continuar-button{
    background-color: #000000;;
    color: white;
    padding: 17px;
    border-radius: 4px;
    margin-top: 37px;
    text-align: center;
    font-weight: 700
}

.login-section .continuar-button:hover{
    cursor: pointer;
}

.login .alterar-email{
    color: rgb(31, 121, 255);
}

.login .alterar-email:hover{
    cursor: pointer;
}

.error-text{
    color: rgb(243, 71, 71);
}

`