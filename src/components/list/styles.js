import styled from "styled-components";

export  const Container = styled.div`




 padding: 0 15px;
 height: 100%;
 flex: 0 0 320px;
 //scroll-snap-align: start;

 
 
 ul{
    padding: 2%;
    overflow-y: scroll;
    max-height: 90%;
    //border: 1px solid rgba(0,0,0,0.2);
    border-radius: 8px;
    background-color: #f8f8f8;
    box-shadow: 0 2px 0 rgba(0,0,0,0.05);
    
 }

 ul::-webkit-scrollbar{
   color: #bad200;
   background-color: transparent;
   width: 10px;
 }

 ul::-webkit-scrollbar-thumb{
   background-color: #bad200;
   border-radius: 7px;

 }

 & + div {
    border-left: 1px solid rgba(0,0,0,0.05);
 }

 header{
    display:  flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    

 }

 h2{
    font-weight: 500;
    font-size: 16px;
    padding: 0 10px;
    
 }

 input{
   font: inherit;
   color: white !important;
   padding: 0 2px;
   border: 0;
   background-color: transparent;
   margin: 10px 0;

 }

 button{
    width: 35px;
    height: 35px;
    border-radius: 18px;
    background-color: #bad200;
    border: 0;
    cursor: pointer;
 }

 button:nth-child(3){
   background-color: red;
 }


 .list-title:focus{
   border-bottom: 1px solid #b5b5b5;
 }
`