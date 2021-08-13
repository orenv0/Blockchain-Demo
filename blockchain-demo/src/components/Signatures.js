import React, { useEffect, useState } from 'react';
import KeyService from '../services/KeysService'
const EC = require('elliptic').ec;

//Had hard time writing this component due to states not rendering in time, Searched for answer online and didnt find any good
//solution so I decided to create var's that will contatin the most up to date DATA from the DB
function Signatures(){
    const ec = new EC('secp256k1')
    const [keys, setKeys] = useState({});
    var signature
    var DBmessage
    var DBprivateKey
    var DBpublicKey
    
    useEffect(() => {
        bringKeys()

    },[])

    function bringKeys() {
        let keyId = 1
        KeyService.getKeys(keyId).then((res) => {
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
            callback()
        });
    }

    function handleChange() {
        console.log("User Interacted with the private key")
        let privateKey = document.getElementById("privateKey").value
        if (privateKey.length > 77){
            random()
            return
        }
        // eslint-disable-next-line
        if (privateKey.length != 0){
            let publicKeyFromPrivate = ec.keyFromPrivate(privateKey).getPublic('hex')
            document.getElementById("publicKey").value = publicKeyFromPrivate
            let message = document.getElementById("messsageData").value
            saveKeyInDB(1,privateKey,publicKeyFromPrivate,"" + message + "")
        }
    }
    function random() {
        let key = ec.genKeyPair()
        let privateKey = key.getPrivate()
        //key.getPrivate() returns a BN object so we need to convert to string so we can store in DB
        let StringPrivateKey = "" + privateKey + ""
        document.getElementById("privateKey").value = privateKey
        let publicKey = key.getPublic('hex')
        document.getElementById("publicKey").value = publicKey
        let message = document.getElementById("messsageData").value
        saveKeyInDB(1,StringPrivateKey,publicKey,"" + message + "")
    }
    function saveKeyInDB(keyId,privateKeyToString,publicKey,message) {
        console.log("Saving in DB")
        let newKey = {
            keysId: keyId,
            privateKey: privateKeyToString,
            publicKey: publicKey,
            message: message
        }
        KeyService.updateKeys(keyId, newKey)

    }
    function messageTextChange(){
        let message = document.getElementById("messsageData").value
        document.getElementById("verifyData").value = message
        let privateKey = document.getElementById("privateKey").value
        let publicKeyFromPrivate = ec.keyFromPrivate(privateKey).getPublic('hex')
        saveKeyInDB(1,privateKey,publicKeyFromPrivate,"" + message + "")
    }

    function verifyTextChange(){
        let message = document.getElementById("verifyData").value
        document.getElementById("messsageData").value = message
        let privateKey = document.getElementById("privateKey").value
        let publicKeyFromPrivate = ec.keyFromPrivate(privateKey).getPublic('hex')
        saveKeyInDB(1,privateKey,publicKeyFromPrivate,"" + message + "")
    }
    function handleSignClicked(){
        console.log("Sign")
         let message = document.getElementById("messsageData").value
         let privateKey = document.getElementById("privateKey").value
         let publicKey = ec.keyFromPrivate(privateKey).getPublic('hex')
         signature = ec.sign(message,privateKey).r.toString('hex')
         document.getElementById("publicKey").value = publicKey
         document.getElementById("MessageSignature").value = signature
         document.getElementById("Signature").value = signature
        saveKeyInDB(1,privateKey,publicKey,"" + message + "")
    }
    function checking(){
        
        let message = document.getElementById("verifyData").value
        let publicKey = document.getElementById("publicKey").value
        let privateKey = document.getElementById("privateKey").value
        let currentSignature = document.getElementById("Signature").value
        signature = ec.sign(DBmessage,DBprivateKey).r.toString('hex')  
        
        console.log(
            "website Object data: \n" +
            "Message: " + message + "\n" +
            "privateKey: " + privateKey + "\n" +
            "publicKey: " + publicKey + "\n" +      
            "signature: " + currentSignature + "\n" 
        )
        console.log(
            "DB DATA:  \n" +
            "Message: " + DBmessage + "\n" +
            "privateKey: " + DBprivateKey + "\n" +
            "publicKey: " + DBpublicKey + "\n" +      
            "signature: " + signature + "\n" 
        )
        // eslint-disable-next-line
        if(publicKey != DBpublicKey || message != DBmessage || currentSignature != signature){
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
    return(
    <div className="warpper">
        <h1 style={{marginLeft:'5px'}}>Signatures</h1>
        <input className="radio" id="one" name="group" type="radio" defaultChecked/>
        <input className="radio" id="two" name="group" type="radio"/>
        <div className="tabs">
            <label className="tab" id="one-tab" htmlFor="one">Sign</label>
            <label className="tab" id="two-tab" htmlFor="two">Verify</label>
        </div>

        <div className="panels">
            <div className="panel" id="one-panel">
                <ul className="tabUl" style = {{listStyle:'none'}}>
                    <li><label>Message</label></li>
                    <li><textarea id="messsageData" defaultValue={keys.message} rows={15} onInput ={messageTextChange.bind(this)}/></li>
                    <li><label>Private Key</label></li>
                    <li><input id="privateKey" defaultValue={keys.privateKey} type="Number" rows={1} onInput={handleChange.bind(this)}/></li>
                    <li><button className="blueButton" style={{width:'91.5%'}} onClick={handleSignClicked.bind(this)}>Sign</button></li>
                    <li><label>Message Signature</label></li>
                    <li><input id="MessageSignature"  disabled rows={1} /></li>
                </ul>
            </div>
            <div className="panel" id="two-panel">
                <ul className="tabUl" style = {{listStyle:'none'}}>
                    <li><label>Message</label></li>
                    <li><textarea id="verifyData" defaultValue={keys.message} rows={15} onInput ={verifyTextChange.bind(this)}/></li>
                    <li><label>public Key</label></li>
                    <li><input id="publicKey" defaultValue={keys.publicKey} rows={1} /></li>
                    <li><label>Signature</label></li>
                    <li><input id="Signature" rows={1} /></li>
                    <li><button className="blueButton" style={{width:'91.5%'}} onClick={verifyClicked.bind(this)}>Verify</button></li>
                </ul>
            </div>
        </div>
    </div>
    )

}
export default Signatures