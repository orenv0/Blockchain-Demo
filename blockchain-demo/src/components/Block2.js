import React, { useState,useEffect } from 'react';
import BlockService from '../services/BlockService';
const SHA256 = require('crypto-js/sha256')


function Block2(props) {
    const [bnumber, setBnumber] = useState(props.blockNumber)
    const [nonce, setNonce] = useState(props.nonce)
    const [data, setData] = useState(props.data)
    const [prev, setPrev] = useState(props.prev)
    const [hash, setHash] = useState(props.hash)

    useEffect(() => {
        
        let nextBlockId = props.id + 1
        if (nextBlockId < 5) {
            let myHash = document.getElementById("result" + props.id + "p" + props.peer).value
            let nextBlockPrev = document.getElementById("prev" + nextBlockId + "p" + props.peer).value
            if (myHash !== nextBlockPrev)
                alert("One or more blocks do not have the correct PREV value as they should!!!")
            // changeBackgroundColorOfAllBlocks('lightpink')
        }

    }, [])
    function calculateHashOnChange(block, nonce, data, prev) {
        return SHA256(block + nonce + data + prev).toString()
    }
    function calculateHashForAllBlocks(blockOffset) {
        for (let i = props.id + blockOffset; i < 6; i++) {
            let tBlockNumber = document.getElementById("blockNumber" + i + "p" + props.peer).value
            let tNonce = document.getElementById("nonce" + i + "p" + props.peer).value
            let tData = document.getElementById("data" + i + "p" + props.peer).value
            let tPrev = document.getElementById("prev" + i + "p" + props.peer).value
            let newHash = calculateHashOnChange(tBlockNumber, tNonce, tData, tPrev)
            let nextBlockId = i + 1
            document.getElementById('result' + i + "p" + props.peer).value = newHash
            if (i < 5)
                document.getElementById('prev' + nextBlockId + "p" + props.peer).value = newHash
        }
    }
    function checkIfNextBlockHashesAreValid(startingBlock) {
        for (let i = startingBlock; i < 6; i++) {
            if (document.getElementById("result" + i + "p" + props.peer).value.substring(0, 4) === Array(5).join("0"))
                document.getElementById("blockColor" + i + "p" + props.peer).style.backgroundColor = 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        }
    }
    function changeBackgroundColorOfAllBlocks(color) {
        for (let i = props.id; i < 6; i++) {
            document.getElementById("blockColor" + i + "p" + props.peer).style.backgroundColor = color
        }
    }

    function handleChange() {
        let myBlockNumber = document.getElementById("blockNumber" + props.id + "p" + props.peer).value
        let myNonce = document.getElementById("nonce" + props.id + "p" + props.peer).value
        let myData = document.getElementById("data" + props.id + "p" + props.peer).value
        let myPrev = document.getElementById("prev" + props.id + "p" + props.peer).value
        // eslint-disable-next-line
        if (myBlockNumber != bnumber || myNonce != nonce || myData != data || myPrev != prev)
            changeBackgroundColorOfAllBlocks('lightpink')
        else
            changeBackgroundColorOfAllBlocks('rgb(' + 227 + ',' + 250 + ',' + 227 + ')')
        calculateHashForAllBlocks(0)

    }
    function mine() {
        let myNonce = 0;
        let myBlockNumber = document.getElementById("blockNumber" + props.id + "p" + props.peer).value
        let myData = document.getElementById("data" + props.id + "p" + props.peer).value
        let myPrev = document.getElementById("prev" + props.id + "p" + props.peer).value
        let myHash = document.getElementById("result" + props.id + "p" + props.peer).value
        while (myHash.substring(0, 4) !== Array(5).join("0")) {
            myNonce = myNonce + 1
            myHash = calculateHashOnChange(myBlockNumber, myNonce, myData, myPrev)
        }
        setHash(myHash)
        setBnumber(myBlockNumber)
        setNonce(myNonce)
        setData(myData)
        setPrev(myPrev)
        document.getElementById("result" + props.id + "p" + props.peer).value = myHash
        document.getElementById("nonce" + props.id + "p" + props.peer).value = myNonce
        document.getElementById("blockColor" + props.id + "p" + props.peer).style.backgroundColor = 'rgb(' + 227 + ',' + 250 + ',' + 227 + ')'
        let nextBlockId = props.id + 1
        if (nextBlockId < 6)
            document.getElementById("prev" + nextBlockId + "p" + props.peer).value = myHash
        calculateHashForAllBlocks(1)
        checkIfNextBlockHashesAreValid(nextBlockId)
        saveBlockInDB(myHash, myBlockNumber, myNonce, myData, myPrev);
    }

    function saveBlockInDB(myHash, myBlockNumber, myNonce, myData, myPrev) {
        let block = {
            blockId: props.id,
            blockNumber: myBlockNumber,
            nonce: myNonce,
            data: myData,
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
                    <li><label>Data:</label></li>
                    <li><textarea id={"data" + props.id + "p" + props.peer} defaultValue={data} rows={15} onInput={handleChange.bind(this)} /></li>
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

export default Block2