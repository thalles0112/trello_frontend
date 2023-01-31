import styled from "styled-components";


export const Container = styled.main`
    display: flex;
    padding: 0 2%;
    width: 100vw;
    height: calc(100% - 80px);


    section{
        display: flex;
        flex-direction: row;
        gap: 2%;
        width: 96vw;
        flex-wrap: wrap;
        flex: 0 0 200;
    }

    section > a{
        box-shadow: 0 2px 2px rgba(0,0,0,0.05);
        width: 250px;
        height: 150px;
        text-decoration: none;
        color: #333;
        border-radius: 6px;
        background-color: #f3f3ff;
        cursor: pointer;
        margin-bottom: 4%;
    }

    section > div:hover{
        background-color: #e5e5ef;
    }
    
    .add-board, .preview-board{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        border: 0;
        box-shadow: 0 2px 2px rgba(0,0,0,0.05);
        width: 250px;
        height: 150px;
        text-decoration: none;
        color: #333;
        border-radius: 6px;
        background-color: #f3f3ff;
        cursor: pointer;
    }

    .preview-board input{
        border: 0;
        border-bottom: 1px solid #aaa;
        background-color: transparent;
        font-size: 1.2em;
        
        width: 90%;
    }

    .board-thumb{
        background-color: #333;
        color: white
    }
    
`