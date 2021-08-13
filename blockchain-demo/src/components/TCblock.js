import React, { useState, useEffect } from 'react';
import BlockService from '../services/BlockService';
const SHA256 = require('crypto-js/sha256')


function TCblock(props) {
    const [bnumber, setBnumber] = useState(props.blockNumber)
    const [nonce, setNonce] = useState(props.nonce)
    const [coinbase, setCoinbase] = useState(props.coinbase)
    const [tx, setTx] = useState(props.tx)
    const [prev, setPrev] = useState(props.prev)
    const [hash, setHash] = useState(props.hash)


    useEffect(() => {

        let nextBlockId = props.id + 1
        if (nextBlockId < 25) {
            let myHash = document.getElementById("result" + props.id + "p" + props.peer).value
            let nextBlockPrev = document.getElementById("prev" + nextBlockId + "p" + props.peer).value
            if (myHash !== nextBlockPrev)
                alert("One or more blocks do not have the correct PREV value as they should!!!")
            // changeBackgroundColorOfAllBlocks('lightpink')
        }

    }, [])

    function calculateHashOnChange(block, nonce, coinbase, txData, prev) {
        return SHA256(block + nonce + coinbase + txData + prev).toString()
    }
    function calculateHashForAllBlocks(blockOffset) {
        for (let i = props.id + blockOffset; i < 26; i++) {
            let tBlockNumber = document.getElementById("blockNumber" + i + "p" + props.peer).value
            let tCoinbase = collectCoinbasePartsIntoOneString(i, props.peer, "client")
            let tNonce = document.getElementById("nonce" + i + "p" + props.peer).value
            let txData = collectAllTxIntoOneDataBlock(i, props.peer)
            let tPrev = document.getElementById("prev" + i + "p" + props.peer).value
            let newHash = calculateHashOnChange(tBlockNumber, tNonce, tCoinbase, txData, tPrev)
            let nextBlockId = i + 1
            document.getElementById('result' + i + "p" + props.peer).value = newHash
            if (i < 25)
                document.getElementById('prev' + nextBlockId + "p" + props.peer).value = newHash
        }
    }
    function checkIfNextBlockHashesAreValid(startingBlock) {
        for (let i = startingBlock; i < 26; i++) {
            if (document.getElementById("result" + i + "p" + props.peer).value.substring(0, 4) === Array(5).join("0"))
                document.getElementById("blockColor" + i + "p" + props.peer).style.backgroundColor = 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        }
    }
    function changeBackgroundColorOfAllBlocks(color) {
        for (let i = props.id; i < 26; i++) {
            document.getElementById("blockColor" + i + "p" + props.peer).style.backgroundColor = color
        }
    }

    function handleChange() {
        let myBlockNumber = document.getElementById("blockNumber" + props.id + "p" + props.peer).value
        let myNonce = document.getElementById("nonce" + props.id + "p" + props.peer).value
        let myCoinbase = collectCoinbasePartsIntoOneString(props.id, props.peer, "client")
        let myTxData = collectAllTxIntoOneDataBlock(props.id, props.peer)
        let myPrev = document.getElementById("prev" + props.id + "p" + props.peer).value
        // eslint-disable-next-line
        if (myBlockNumber != bnumber || myNonce != nonce || myCoinbase != convertCoinbaseDbVersionToClientVersion(coinbase) || myTxData != convertTxArrayToTxData(tx) || myPrev != prev)
            changeBackgroundColorOfAllBlocks('lightpink')
        else
            changeBackgroundColorOfAllBlocks('rgb(' + 227 + ',' + 250 + ',' + 227 + ')')
        calculateHashForAllBlocks(0)

    }
    function mine() {
        let myNonce = 0;
        let myBlockNumber = document.getElementById("blockNumber" + props.id + "p" + props.peer).value
        let myCoinbase = collectCoinbasePartsIntoOneString(props.id, props.peer, "client")
        let myTxData = collectAllTxIntoOneDataBlock(props.id, props.peer)
        let myPrev = document.getElementById("prev" + props.id + "p" + props.peer).value
        let myHash = document.getElementById("result" + props.id + "p" + props.peer).value
        while (myHash.substring(0, 4) !== Array(5).join("0")) {
            myNonce = myNonce + 1
            myHash = calculateHashOnChange(myBlockNumber, myNonce, myCoinbase, myTxData, myPrev)
        }
        setHash(myHash)
        setBnumber(myBlockNumber)
        setNonce(myNonce)
        let dbCoinbase = collectCoinbasePartsIntoOneString(props.id, props.peer)
        setCoinbase(myCoinbase)
        let txArray = collectAllTxIntoArrayOfStrings()
        setTx(txArray)
        setPrev(myPrev)
        document.getElementById("result" + props.id + "p" + props.peer).value = myHash
        document.getElementById("nonce" + props.id + "p" + props.peer).value = myNonce
        document.getElementById("blockColor" + props.id + "p" + props.peer).style.backgroundColor = 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        let nextBlockId = props.id + 1
        if (nextBlockId < 26)
            document.getElementById("prev" + nextBlockId + "p" + props.peer).value = myHash
        calculateHashForAllBlocks(1)
        checkIfNextBlockHashesAreValid(nextBlockId)
        saveBlockInDB(myHash, myBlockNumber, myNonce, dbCoinbase, txArray, myPrev);
    }
    function disassembleTransaction(t, part) {
        t = t.replace('$', '@')
        t = t.replace('From:', '@')
        t = t.replace('->', '@')
        let tArr = t.split('@')

        switch (part) {
            case 'm':
                return tArr[1]
            case 'f':
                return tArr[2]
            case 't':
                return tArr[3]
            default:
                return;
        }
    }
    function disassembleCoinbase(part) {
        let cb = coinbase
        cb = cb.replace('$', '@')
        cb = cb.replace('->', '@')
        let tArr = cb.split('@')

        switch (part) {
            case 'm':
                return tArr[1]
            case 't':
                return tArr[2]
            default:
                return;
        }
    }
    function collectCoinbasePartsIntoOneString(blockId, peer, version = "db") {
        let CoinbaseString = ""
        let cm = document.getElementById("cmoney" + blockId + "p" + peer).value
        let ct = document.getElementById("cto" + blockId + "p" + peer).value
        if (version === "client") {
            CoinbaseString = cm + ct
            return CoinbaseString
        } else {
            CoinbaseString = "$" + cm + "->" + ct
            return CoinbaseString
        }

    }

    function collectAllTxIntoOneDataBlock(blockId, peer) {
        let txDataBlock = ""
        let i = 0;
        while (document.getElementById("tmoney" + blockId + "p" + peer + "i" + i) != null) {
            let tm = document.getElementById("tmoney" + blockId + "p" + peer + "i" + i).value
            let tf = document.getElementById("tfrom" + blockId + "p" + peer + "i" + i).value
            let tt = document.getElementById("tto" + blockId + "p" + peer + "i" + i).value
            txDataBlock = txDataBlock + tm + tf + tt
            i++
        }
        return txDataBlock
    }
    function collectAllTxIntoArrayOfStrings() {
        let txArr = []
        for (let i = 0; i < tx.length; i++) {
            let tm = document.getElementById("tmoney" + props.id + "p" + props.peer + "i" + i).value
            let tf = document.getElementById("tfrom" + props.id + "p" + props.peer + "i" + i).value
            let tt = document.getElementById("tto" + props.id + "p" + props.peer + "i" + i).value
            let tString = '$' + tm + 'From:' + tf + '->' + tt
            txArr.push(tString)
        }
        return txArr
    }
    function convertCoinbaseDbVersionToClientVersion(originalCoinbase) {
        let newCoinbaseString = ""
        originalCoinbase = originalCoinbase.replace('$', '@')
        originalCoinbase = originalCoinbase.replace('->', '@')
        let tArr = originalCoinbase.split('@')
        newCoinbaseString = tArr[1] + tArr[2]
        return newCoinbaseString
    }

    function convertTxArrayToTxData(arr) {
        let txDataBlock = ""
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace('$', '@')
            arr[i] = arr[i].replace('From:', '@')
            arr[i] = arr[i].replace('->', '@')
            let tArr = arr[i].split('@')
            txDataBlock = txDataBlock + tArr[1] + tArr[2] + tArr[3]
        }
        return txDataBlock

    }

    function saveBlockInDB(myHash, myBlockNumber, myNonce, dbCoinbase, txArray, myPrev) {
        let block = {
            blockId: props.id,
            blockNumber: myBlockNumber,
            nonce: myNonce,
            data: props.data,
            coinbase: dbCoinbase,
            tx: txArray,
            prev: myPrev,
            hash: myHash,
            peer: props.peer
        }
        BlockService.updateBlockByIdAndPeer(props.id, props.peer, block)

    }

    return (
        <div >

            <div id={"blockColor" + props.id + "p" + props.peer} className="Reactiveblock block">
                <ul>
                    <li><label>Block:</label></li>
                    <li><input value='#' disabled style={{ width: '30px', textAlign: 'center' }} /><input id={"blockNumber" + props.id + "p" + props.peer} type="Number" style={{ width: '760px' }} defaultValue={bnumber} rows={1} onInput={handleChange.bind(this)} /></li>
                </ul>
                <ul>
                    <li><label>Nonce:</label></li>
                    <li><input id={"nonce" + props.id + "p" + props.peer} defaultValue={nonce} rows={1} onInput={handleChange.bind(this)} /></li>
                </ul>
                <ul>
                    <li><label>Coinbase:</label></li>
                    <li><input value='$' disabled style={{ width: '30px', textAlign: 'center' }} /><input id={"cmoney" + props.id + "p" + props.peer} style={{ width: '100px' }} defaultValue={disassembleCoinbase('m')} rows={1} onInput={handleChange.bind(this)} /><input value='->' disabled style={{ width: '30px', textAlign: 'center' }} /><input id={"cto" + props.id + "p" + props.peer} style={{ width: '100px' }} defaultValue={disassembleCoinbase('t')} rows={1} onInput={handleChange.bind(this)} /> </li>
                </ul>
                <ul>
                    <li><label>Tx:</label></li>
                    <ul style={{ marginTop: "-35px", marginLeft: "110px" }}>
                        {
                            tx.map((t, index) =>
                                <li><br /> <input value='$' disabled style={{ width: '30px', textAlign: 'center' }} /><input id={"tmoney" + props.id + "p" + props.peer + "i" + index} style={{ width: '100px' }} defaultValue={disassembleTransaction(t, 'm')} rows={1} onInput={handleChange.bind(this)} /> <input value='From:' disabled style={{ width: '35px', textAlign: 'center' }} /><input id={"tfrom" + props.id + "p" + props.peer + "i" + index} style={{ width: '100px' }} defaultValue={disassembleTransaction(t, 'f')} rows={1} onInput={handleChange.bind(this)} /> <input value='->' disabled style={{ width: '30px', textAlign: 'center' }} /><input id={"tto" + props.id + "p" + props.peer + "i" + index} style={{ width: '100px' }} defaultValue={disassembleTransaction(t, 't')} rows={1} onInput={handleChange.bind(this)} /></li>)
                        }
                    </ul>
                </ul>
                <ul>
                    <li><label>Prev:</label></li>
                    <li><input id={"prev" + props.id + "p" + props.peer} className="PrevResult" defaultValue={prev} onInput={handleChange.bind(this)} /></li>
                </ul>
                <ul>
                    <li><label>Hash:</label></li>
                    <li><input id={'result' + props.id + "p" + props.peer} className="HashResult" defaultValue={hash} /></li>
                </ul>
                <ul>
                    <li></li>
                    <li><button className="blueButton" onClick={mine.bind(this)}>Mine<i className="fa fa-refresh fa-spin"></i></button></li>
                </ul>
            </div>
        </div>
    )
}

export default TCblock