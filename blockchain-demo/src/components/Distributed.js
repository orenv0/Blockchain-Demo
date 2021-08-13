import React from 'react';
import Peer from './Peer'


function Distributed() {

    return (
        <div className="blockchain">
            <h1 style={{ marginLeft: '210px' }}>Distributed</h1>
            <ul>

                <h2>Peer A</h2>
                <li> <Peer peerId={0} blockType={"regular"} /> </li>
                <h2>Peer B</h2>
                <li> <Peer peerId={1} blockType={"regular"} /> </li>
                <h2>Peer C</h2>
                <li> <Peer peerId={2} blockType={"regular"} /> </li>

            </ul>
        </div>
    )
}

export default Distributed