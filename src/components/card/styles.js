import styled, {css} from "styled-components";

export const Container = styled.div`


    
    .card{
    position: relative;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 1px 4px 0 rgba(192 ,208, 230, 0.8);
    border-top: 20px solid rgba(230, 236, 245, 0.4);
    font-weight: 500;
    padding: 15px;
    cursor: grab;
    display: flex;
    justify-content: space-between;
    color: black;
    touch-action: none;
    }

    .card input{
        color: black !important
    }
    .card a{
        color: black;
    }
    
    header{
        position: relative;
        top: -22px;
        left: 0px;
        
    }

    p{
        font-weight: 500;
        line-height: 20px;
        margin: 0;
        text-align: left;
        width: 100%;
    }

    img{
        width: 24px;
        height: 24px;
        border-radius: 2px;
        margin-top: 5px
    }

    .edit-card-button{
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
    }



    ${props => props.isDragging &&  css`
        
 
        position: fixed;
        transform: rotate(10deg);
        
        
        width: 270px;
        z-index: 4;
       // padding-top: 31px;
        border-radius: 2px;
        background: transparent;
        visibility: visible;
        box-shadow: none;
        cursor: grabbing !important;

        p, img, header {
            opacity: 1;
        }
    `}




`

export const Label = styled.span`
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
    background: ${(props)=> props.color};
`