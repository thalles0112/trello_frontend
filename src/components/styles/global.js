import { createGlobalStyle } from "styled-components";
import bg from '../../assets/bg.jpg'

export default createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
}

html, body, #root {
    height: calc(100% - 10px)
}

body {
    font-family: 'Poppins', sans-serif;
    background: #ecf1f8;
   // background: #aaa;
    
    color: #333;
    -webkit-font-smoothing: antialised !important;
    background-image: url(${bg}) !important;
    background-size: auto;
    background-repeat: no-repeat;
    
}

ul{
    list-style: none
}

a{
    text-decoration: none;
    
}

a:active{
    color: #3574F2;
}

.grayed{
    color: #ddd;
}
`