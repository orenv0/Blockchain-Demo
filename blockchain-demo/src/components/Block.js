import React, { useEffect, useState } from 'react';
const SHA256 = require('crypto-js/sha256')


function Block(){
    const [Block, setBlock] = useState(1);
    const [Data, setData] = useState(''); 
    var myNonce = 0
    var myHash = ''
    //MARK: Similar to componentDidMount and componentDidUpdate:
    useEffect(() => { 
      console.log("Effect")
      check()
    })

   
    function calculateHashOnChange(block,nonce,data){
        return SHA256(block+nonce+data).toString()
    }

    function check(){
        console.log("check")
        myNonce = 0;
        let blockNumber = document.getElementById("blockNumber").value
        let data = document.getElementById("data").value
        while(myHash.substring(0,4) !== Array(5).join("0")){
            myNonce = myNonce + 1
            myHash = calculateHashOnChange(blockNumber,myNonce,data)
        }
        console.log("Block: " + Block + "\nData: " + Data + "\nNonce: " + myNonce + "\nHash: " + myHash)
        //setHash(myHash) - render 2 times to the screen so we switched it and deleted the state
        document.getElementById("result").value = myHash
        document.getElementById("nonce").value = myNonce
        document.getElementById("blockColor").style.backgroundColor= 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
    }

    function handleChange(){
        let blockNumber = document.getElementById("blockNumber").value
        let nonce = document.getElementById("nonce").value
        let data = document.getElementById("data").value
        // eslint-disable-next-line
        if(blockNumber != Block || nonce != myNonce || data != Data)
            document.getElementById("blockColor").style.backgroundColor='lightpink'
        else   
            document.getElementById("blockColor").style.backgroundColor= 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        document.getElementById("result").value = calculateHashOnChange(blockNumber,nonce,data)

    }
    
     function mine(){
              console.log("Mine") 
              let blockNumber = document.getElementById("blockNumber").value
              let data = document.getElementById("data").value
              setBlock(blockNumber)
              setData(data)              
        }
       return(
           <div>
               <h1 style={{marginLeft:'210px'}}>Block</h1>
               <div id="blockColor" className="Reactiveblock block">
                <ul>
                   <li><label>Block:</label></li>
                   <li><input value='#' disabled style={{width:'30px',textAlign:'center'}}/><input id="blockNumber" type="Number" style={{width:'760px'}} defaultValue={Block} rows={1}onInput={handleChange.bind(this) } /></li>
                 </ul>
                 <ul>
                   <li><label>Nonce:</label></li>
                   <li><input id="nonce" defaultValue={myNonce} rows={1}  onInput={ handleChange.bind(this) }/></li>
                 </ul>
                 <ul>
                   <li><label>Data:</label></li>
                   <li><textarea id="data" rows={15} onInput={ handleChange.bind(this)}/></li>
                 </ul>
                 <ul>
                     <li><label>Hash:</label></li>
                     <li><input id="result" className="HashResult" value={myHash} disabled/></li>
                 </ul>
                 <ul>
                     <li></li>
                       <li><button className="blueButton" onClick={mine.bind(this)}>Mine<i className="fa fa-refresh fa-spin"></i></button></li>
                 </ul>
               </div>
           </div> 
       )
}

export default Block