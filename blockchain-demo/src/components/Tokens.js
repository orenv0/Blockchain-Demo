import React from 'react';
import Peer from './Peer'


function Tokens() {

    return (
        <div className="blockchain">
            <h1 style={{ marginLeft: '210px' }}>Tokens</h1>
            <ul>

                <h2>Peer A</h2>
                <li> <Peer peerId={0} blockType={"withTokens"}/> </li>
                <h2>Peer B</h2>
                <li> <Peer peerId={1} blockType={"withTokens"}/> </li>
                <h2>Peer C</h2>
                <li> <Peer peerId={2} blockType={"withTokens"}/> </li>

            </ul>
        </div>
    )
}

export default Tokens