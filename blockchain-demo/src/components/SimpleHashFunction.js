import React, { useEffect, useState } from 'react';
const SHA256 = require('crypto-js/sha256')

function SimpleHashFunction(){
    const [Data, setData] = useState('');
    const [Hash,setHash] = useState('');

    //MARK: Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {  
      calculateHash()
    })
    
     function   calculateHash(){
        let newHash = SHA256(Data).toString()
        setHash(newHash)
     }
     
     //MARK: create new hash on user input
      function handleInput(e){
              setData(e.target.value)
      }

       return(
           <div>
               <h1 style={{marginLeft:'210px'}}>SHA256 Hash</h1>
               <div className="block">
                 <ul>
                   <li><label>Data:</label></li>
                   <li><textarea rows={15} onInput={handleInput.bind(this) } /></li>
                 </ul>
                 <ul>
                     <li><label>Hash:</label></li>
                     <li><input className="HashResult" value={Hash} disabled/></li>
                 </ul>
               </div>
         </div> 
        )
}

export default SimpleHashFunction