import React, { useEffect, useState } from 'react';
import BlockService from '../services/BlockService'
import Block2 from './Block2'
import Tblock from './Tblock'
import TCblock from './TCblock'
import Fblock from './Fblock'


function Peer(props) {
    const [blocks, setBlocks] = useState([]);
    useEffect(() => {
        bringBlocks()
    }, [])
    function bringBlocks() {
        BlockService.getAllBlocksByPeerAndType(props.peerId, props.blockType).then((res) => {
            setBlocks(res.data)
        });

    }
    switch (props.blockType) {
        case "regular":
            return (
                <div className="blockchain">
                    <ul>
                        {
                            blocks.map((block) =>
                                <li key={block.blockId}> <Block2 id={block.blockId} blockNumber={block.blockNumber} nonce={block.nonce} data={block.data} prev={block.prev} hash={block.hash} peer={block.peer} /> </li>)
                        }
                    </ul>
                </div>
            )

        case "withTokens":
            return (
                <div className="blockchain">
                    <ul>
                        {
                            blocks.map((block) =>
                                <li key={block.blockId}> <Tblock id={block.blockId} blockNumber={block.blockNumber} nonce={block.nonce} data={block.data} tx={block.tx} prev={block.prev} hash={block.hash} peer={block.peer} /> </li>)
                        }
                    </ul>
                </div>
            )
        case "withTokensAndCoinbase":
            return (
                <div className="blockchain">
                    <ul>
                        {
                            blocks.map((block) =>
                                <li key={block.blockId}> <TCblock id={block.blockId} blockNumber={block.blockNumber} nonce={block.nonce} data={block.data} tx={block.tx} coinbase={block.coinbase} prev={block.prev} hash={block.hash} peer={block.peer} /> </li>)
                        }
                    </ul>
                </div>
            )
        case "fatBlockchain":
            return (
                <div className="blockchain">
                    <ul>
                        {
                            blocks.map((block) =>
                                <li key={block.blockId}> <Fblock id={block.blockId} blockNumber={block.blockNumber} nonce={block.nonce} data={block.data} tx={block.tx} coinbase={block.coinbase} prev={block.prev} hash={block.hash} peer={block.peer} /> </li>)
                        }
                    </ul>
                </div>
            )
        default:
            return;
    }

}

export default Peer