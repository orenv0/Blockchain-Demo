import React from 'react';
import Peer from './Peer'


function Blockchain() {

    return (
        <div className="blockchain">
            <h1 style={{ marginLeft: '210px' }}>Blockchain</h1>
            <Peer peerId={0} blockType={"regular"}/>
        </div>
    )
}

export default Blockchain