import React, { useEffect, useState } from 'react';
import KeyService from '../services/KeysService'
const EC = require('elliptic').ec;


function Transaction(){
    const ec = new EC('secp256k1')
    const [keys, setKeys] = useState({});

    var signature
    var DBmessage
    var DBprivateKey
    var DBpublicKey
    var DBto
    var DBmoney

    useEffect(() => {
        bringKeys()
    },[])

    function bringKeys() {
        let keyId = 1
        KeyService.getKeys(keyId).then((res) => {
            console.log(res.data)
            setKeys(res.data)
        });
    }

     function bringKeysAndCheck(callback) {
        let keyId = 1
        KeyService.getKeys(keyId).then((res) => {
            setKeys(res.data)
            DBmessage = res.data.message
            DBprivateKey = res.data.privateKey
            DBpublicKey = res.data.publicKey
            DBto = res.data.to
            DBmoney = res.data.money
            callback()
        });
    }
    function handleSignTabPublicKeyChanges(){
        let publicKey = document.getElementById("from").value
        document.getElementById("from2").value = publicKey
    }
    function handleVerifyPublicKeyTabChanges(){
        let publicKey = document.getElementById("from2").value
        document.getElementById("from").value = publicKey
    }
    function handleSignTabChanges() {
    console.log("User Interacted with the Sign Tab info")
        let privateKey = document.getElementById("privateKey").value
        let money = document.getElementById("money").value
        document.getElementById("money2").value = money
        let to = document.getElementById("to").value
        document.getElementById("to2").value = to
        if (privateKey.length > 77){
            random(money,to)
            return
        }
        if (privateKey.length != 0){
            let publicKeyFromPrivate = ec.keyFromPrivate(privateKey).getPublic('hex')
            document.getElementById("from").value = publicKeyFromPrivate
            document.getElementById("from2").value = publicKeyFromPrivate
            saveKeyInDB(1,privateKey,publicKeyFromPrivate,money,to)
        }

    }
    function random(money,to) {
        let key = ec.genKeyPair()
        let privateKey = key.getPrivate()
        //key.getPrivate() returns a BN object so we need to convert to string so we can store in DB
        let StringPrivateKey = "" + privateKey + ""
        document.getElementById("privateKey").value = privateKey
        let publicKey = key.getPublic('hex')
        document.getElementById("from").value = publicKey
        document.getElementById("from2").value = publicKey
        saveKeyInDB(1,StringPrivateKey,publicKey,money,to)
    }
    function handleVerifyTabChanges() {
        let money = document.getElementById("money2").value
        document.getElementById("money").value = money
        let to = document.getElementById("to2").value
        document.getElementById("to").value = to
        let privateKey = document.getElementById("privateKey").value
        let publicKey = ec.keyFromPrivate(privateKey).getPublic('hex')
        saveKeyInDB(1,privateKey,publicKey,money,to)
    }
    
        function handleSignClicked(){
        console.log("Sign")
         let money = document.getElementById("money").value
         let privateKey = document.getElementById("privateKey").value
         let publicKey = ec.keyFromPrivate(privateKey).getPublic('hex')
         let to = document.getElementById("to").value
         // signature now uses also the person we send the money to 
         // in order to notice changes if user tries to change the addressee
         signature = ec.sign(money + to,privateKey).r.toString('hex')
         document.getElementById("from").value = publicKey
         document.getElementById("from2").value = publicKey
         document.getElementById("MessageSignature").value = signature
         document.getElementById("signature2").value = signature
         saveKeyInDB(1,privateKey,publicKey,money,to)
    }
    function checking(){
        
        let money = document.getElementById("money2").value
        let publicKey = document.getElementById("from2").value
        let currentSignature = document.getElementById("signature2").value
        let to = document.getElementById("to2").value
        signature = ec.sign(DBmoney + to,DBprivateKey).r.toString('hex')  
        // eslint-disable-next-line
        if(publicKey != DBpublicKey || money != DBmoney || currentSignature != signature || to != DBto){
            document.getElementById("two-panel").style.backgroundColor= 'lightpink' 
        }
        else{
            document.getElementById("two-panel").style.backgroundColor= 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        }
        
    }

    function verifyClicked(){
        //Callback function to make sure we read the data from the DB otherwise the website will show an error
        console.log("Verify")
        bringKeysAndCheck(checking) 
    }
     function saveKeyInDB(keyId,privateKeyToString,publicKey,money,to) {
        let newKey = {
            keysId: keyId,
            privateKey: privateKeyToString,
            publicKey: publicKey,
            money : money,
            to: to
        }
        KeyService.updateKeys(keyId, newKey)

    }

    return(
    <div className="warpper">
        <h1 style={{marginLeft:'5px'}}>Transaction</h1>
        <input className="radio" id="one" name="group" type="radio" defaultChecked/>
        <input className="radio" id="two" name="group" type="radio"/>
        <div className="tabs">
            <label className="tab" id="one-tab" htmlFor="one">Sign</label>
            <label className="tab" id="two-tab" htmlFor="two">Verify</label>
        </div>

        <div className="panels">
            <div className="panel Transaction" id="one-panel">
                <ul className="tabUl" style = {{listStyle:'none'}}>
                    <li><label>Message</label></li>
                </ul>
                <ul className = "columns">
                    <li><input value='$' disabled style={{width:'30px',textAlign:'center'}}/><input style={{width:'365px'}} id="money" defaultValue={keys.money} onInput={handleSignTabChanges.bind(this)}/></li>
                    <li><input value='From' disabled style={{width:'45px',textAlign:'center'}}/><input style={{width:'365px'}} id="from" defaultValue={keys.publicKey} onInput={handleSignTabPublicKeyChanges.bind(this)}/></li>
                    <li><input value='->' disabled style={{width:'30px',textAlign:'center'}}/><input style={{width:'360px'}} id="to" defaultValue={keys.to} onInput={handleSignTabChanges.bind(this)}/></li>
                </ul>
                <ul className="rows">
                    <li><label>Private Key:</label></li>
                    <li><input id="privateKey" type='Number' defaultValue={keys.privateKey} onInput={handleSignTabChanges.bind(this)}/></li>
                    <li><button className="blueButton" style={{width:'91.7%'}} onClick = {handleSignClicked.bind(this)}>Sign</button></li>
                    <li><label>Message Signature</label></li>
                    <li><input id="MessageSignature" disabled rows={1} /></li>
                </ul>
            </div>
            <div className="panel" id="two-panel">
                <ul className="tabUl" style = {{listStyle:'none'}}>
                    <li><label>Message</label></li>
                </ul>
                    <ul className = "columns">
                        <li><input value='$' disabled style={{width:'30px',textAlign:'center'}}/><input style={{width:'365px'}} id="money2" defaultValue={keys.money} onInput={handleVerifyTabChanges.bind(this)}/></li>
                        <li><input value='From' disabled style={{width:'45px',textAlign:'center'}}/><input style={{width:'365px'}} id="from2" defaultValue={keys.publicKey} onInput={handleVerifyPublicKeyTabChanges.bind(this)}/></li>
                        <li><input value='->' disabled style={{width:'30px',textAlign:'center'}}/><input style={{width:'360px'}} id="to2" defaultValue={keys.to} onInput={handleVerifyTabChanges.bind(this)}/></li>
                    </ul>
                    <ul className="rows">
                        <li><label>signature</label></li>
                        <li><input id="signature2"/></li>
                        <li><button className="blueButton" style={{width:'91.7%'}} onClick = {verifyClicked.bind(this)}>Verify</button></li>
                    </ul>
            </div>
        </div>
    </div>
    )

}
export default Transaction