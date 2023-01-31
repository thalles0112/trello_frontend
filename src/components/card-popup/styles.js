import styled from "styled-components";

export const Container = styled.div`
    background-color: #ecf1f8;
    
    color: #3b3b3b;
    display: flex;
    position: fixed;
    padding: 25px;
    top: 100px;
    width: 50%;
    height: calc(100% - 200px);
    
    z-index: 4;
    margin-left: 25%;
    margin-right: 25%;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    
    @media only screen and (max-width: 714px){
            width: 95%;
            margin: 0;
        
    }


    main{
        width: 100%;
        overflow-y: scroll;
    }
    main::-webkit-scrollbar{
    width: 10px;

}

    main::-webkit-scrollbar-track{
    background-color: transparent;
    width: 10px;
    
}

    main::-webkit-scrollbar-thumb{
    background-color: #bbb;
    border-radius: 14px;
    width: 10px;
}


    main div:focus{
        outline: 2px solid rgba(0,0,200, 0.4);
    }

    span{
        display: unset !important;
    }

    .text-editor{
        border-bottom: 1px solid rgba(0,0,0,0.2);
        width: 90%;
        margin: 0 5%;
    }

    .mention {
        z-index: 16 !important;
    }

    .text-editor li{
        margin-left: 25px;
    }

    .tool-bar{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
    }

    .toolbar-button{
        background: none;
        border: 1px solid rgba(0,0,0,0.2);
        width: 36px;
        height: 36px;
    }

    .toolbar-button.active{
        background: #bad200;
        opacity: 0.4;
    }

    .comentarios{
        margin-top: 30px;
    }
    .scroll-list{
        
        max-height: 450px;
        overflow-y: scroll;
    }

    .scroll-list::-webkit-scrollbar{
    height: 12px;
}

.scroll-list::-webkit-scrollbar-track{
    background-color: transparent;
    height: 10px;
    
}

.scroll-list::-webkit-scrollbar-thumb{
    
    border-radius: 14px;
    width: 0;
}

    .comment{
        display: flex;
        background-color: white;
        border-radius: 9px;
        padding: 4px;
        box-shadow: 0 2px 2px rgba(0,0,0,0.1);
        margin: 14px 0;
        gap: 2%;
    }

    .date{
        font-size: 0.7em;
    }

    .comment.new{
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        
    }

    .comment.new .comment-data{
        display: flex;
        width: 85%;
    }

    .insert-comment--input{
        border: 0;
        outline: 0;
        font: inherit;
        width: 90%;
        
        word-wrap: break-word;
    }

    .comment-content{
        width: 90%;
    }

    .user-name{
        font-weight: bold;
    }

    .user-picture{
        background-color: #bad200;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 14px;
    }

    .save-comment{
        border: 0;
        background-color: #bad200;
        padding: 5px;
        border-radius: 9px;
        font: inherit;
        color: white;
        cursor: pointer;   
    }

.insert-comment--input[contenteditable=true]:empty:not(:focus)::before{
  content:'Escrever um comentário...';
  color:gray;
  
}
`