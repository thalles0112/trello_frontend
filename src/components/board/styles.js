import styled from "styled-components"


export const Container = styled.div`


color: #333;
height: calc(100% - 80px - 73px);
width: 100%;
display: flex;
align-items: center;
margin: 0;


    



.scroll-horizontal-list{
    display: flex;
    
    height: calc(100% - 80px);
    overflow-x: scroll;
    width: 100%;
    align-items: center;
}


.grayed{
    color: #fff !important
}

@media only screen and (max-width: 800px) {
    .scroll-horizontal-list{
        scroll-behavior: smooth;
        scroll-snap-type: x mandatory;
        scroll-snap-align: initial;
        
            }
        }

.scroll-horizontal-list::-webkit-scrollbar{
    height: 12px;
}

.scroll-horizontal-list::-webkit-scrollbar-track{
    background-color: transparent;
    height: 10px;
    
}

.scroll-horizontal-list::-webkit-scrollbar-thumb{
    background-color: #333;
    border-radius: 14px;
    height: 10px;
}

#add-list-button{
    margin-left: 10%;
    width: 100px;
    height: 100px;
    border: 0;
    border-radius: 100%;
    background-color: #bad200;
    opacity: 0.4;
    
    cursor: pointer;
}
`
export const BoardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2%;
    background-color: white;
    
    
    box-shadow: 2px 0 3px gray;


.connection-status{
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.board-title {
    
    margin: 15px;
    border: 0;
    outline: 0;
    background-color: transparent;
    font-size: 1.32em;
    margin-left: 12px;
}

span{
    cursor: pointer;
    display: flex;
    align-items: center;
}


`

export const Options = styled.div`
    @keyframes appear {
        0%{width:0px; opacity: 0.0; height: 0;}
        50%{width: 150px; opacity: 1.0; height: 250px;}
        100%{width: 300px; opacity: 1.0; height: 500px;}
    }
    
    animation: appear 0.1s linear forwards;
    position: absolute;
    right: 7%;
    top: 100px;
    background-color:  #ecf1f8;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
    overflow: hidden;
    z-index: 4;

    .options li{
        cursor: pointer;
    }

    .sub-options{
        padding-left: 20px;
    }
    .sub-options li{
        border-top: 1px solid rgba(100,100,100,0.1);
        
        margin-bottom: 2px;
    }

    .sub-options .selected{
        background-color: rgba(200,255,0,0.1);
    }
    
`

