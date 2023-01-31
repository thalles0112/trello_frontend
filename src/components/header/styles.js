import styled from "styled-components";

export const Container = styled.div`
    .apagar-tudo{
        color: white;
        font-weight: 700;
        width: 100%;
    }

    .apagar-tudo:hover{
        color: red;
        box-shadow: 0 0 10px red, 0 0 20px red, 0 0 30px red;
        cursor: pointer;
    }

    .main-header{
        height: 80px;
        padding: 0 30px;
        background: #3b3b3f;
        color: #FFF;
        width: 100% ;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;

    }

    .header-items{
        display: flex;
        align-items: flex-end;
        width: 100%;
        
        gap: 2%;
    }

    @media only screen and (max-width: 714px){
        .nav-item, .apagar-tudo{
            display: none;
        }
    }

    .nav-item{
        cursor: pointer;
    }

    .header-logo {
        position: relative;
        width: 300px;
        height: fit-content;
        align-items: center;
        gap: 6px;
        display: flex;
        
    }

    #hnb-square{
        border: 3px solid #bad200;
        padding: 1px 8px;
        border-radius: 6px;
    }

    #atividades-text-under-logo{
        position: absolute;
        top: 55px;
        left: 30px;
        color: #bad200;
        
        font-size: 10px;
    }

    .avatar-wrapper{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-size: 0.8em;
    }

    .avatar{
        border-radius: 50%;
        width: 40px;
        
    }

    .search-and-profile{
        display: flex;
        align-items: center;
        //border: 1px solid red;
        width: 8%;
        justify-content: space-evenly;
    }
`