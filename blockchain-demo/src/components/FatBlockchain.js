import React from 'react';
import Peer from './Peer'


function FatBlockchain() {

    return (
        <div className="blockchain">
            <h1 style={{ marginLeft: '210px' }}>Fat Blockchain</h1>
            <ul>

                <h2>Peer A</h2>
                <li> <Peer peerId={0} blockType={"fatBlockchain"} /> </li>
                <h2>Peer B</h2>
                <li> <Peer peerId={1} blockType={"fatBlockchain"} /> </li>
                <h2>Peer C</h2>
                <li> <Peer peerId={2} blockType={"fatBlockchain"} /> </li>

            </ul>
        </div>
    )
}

export default FatBlockchain