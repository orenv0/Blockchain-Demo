import React, { useEffect, useState } from 'react';
import KeyService from '../services/KeysService'
const EC = require('elliptic').ec



function Keys() {
    const ec = new EC('secp256k1')
    const [keys, setKeys] = useState({});
    
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

    function handleChange() {
        console.log("User Interacted with the private key")
        let privateKey = document.getElementById("privateKey").value
        if (privateKey.length > 77){
            random()
            return
        }
        if (privateKey.length != 0){
            let publicKeyFromPrivate = ec.keyFromPrivate(privateKey).getPublic('hex')
            document.getElementById("publicKey").value = publicKeyFromPrivate
            saveKeyInDB(1,privateKey,publicKeyFromPrivate)
        }

    }
    // Cant store privateKey type in DB so I changed it to String
    function random() {
        let key = ec.genKeyPair()
        let privateKey = key.getPrivate()
        //key.getPrivate() returns a BN object so we need to convert to string so we can store in DB
        let StringPrivateKey = "" + privateKey + ""
        document.getElementById("privateKey").value = privateKey
        document.getElementById("publicKey").value = key.getPublic('hex')
        saveKeyInDB(1,StringPrivateKey,key.getPublic('hex'))
    }
    function saveKeyInDB(keyId,privateKeyToString,publicKey) {
        let newKey = {
            keysId: keyId,
            privateKey: privateKeyToString,
            publicKey: publicKey
        }
        KeyService.updateKeys(keyId, newKey)

    }
    return (
        <div>
            <div className="Keys">
                <h1>Public / Private Keys Pair</h1>
                <ul>
                    <li><label>Private Key:</label></li>
                    <li><input id="privateKey" type="Number" defaultValue={keys.privateKey} rows={1} onInput={handleChange.bind(this)} /><button onClick={random.bind(this)}>Random</button></li>           
                    <li><label>Public Key:</label></li>
                    <li><input id="publicKey" disabled style={{ width: '97%' }} defaultValue={keys.publicKey} rows={1} /></li>
                </ul>
            </div>
        </div>
    )
}

export default Keys