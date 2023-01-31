export function status(res) {
    // res.ok
    if( res.status >= 200 && res.status < 300){
      return res.json();
    }
    throw new Error(res.statusText);
  }

export function removeSpaces(string){
  let newString = ''
  let idx =0
  string.split(' ').map(word=>{
    if (idx == 0){
      newString += word
    }

    else if(idx < string.split(' ').length ){
      newString+= '-'+word
    }  
    else if (idx == string.split(' ').length){
      newString+=word
    }
    
    idx++
    })



    return newString
}