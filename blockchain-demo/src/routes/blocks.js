const express = require('express')
const Block = require('../models/block')
const router = express.Router()


//create a block

router.post('/', async (req, res) => {
    const block = new Block({
        blockId: req.body.blockId,
        blockNumber: req.body.blockNumber,
        nonce: req.body.nonce,
        data: req.body.data,
        coinbase: req.body.coinbase,
        tx: req.body.tx,
        prev: req.body.prev,
        hash: req.body.hash,
        peer: req.body.peer,
        type: req.body.type

    })
    try {
        const newBlock = await block.save()
        res.json(newBlock)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//get a block with blockId
router.get('/:blockId', getBlock, (req, res) => {
    res.send(res.block)
})
//get all blocks by peer and type
router.get('/byPeerAndType/:peer/:type', async (req, res) => {
    try {
        const blocks = await Block.find({ peer: req.params.peer, type: req.params.type })
        res.json(blocks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//get a block by blockId and peer
router.get('/byBlockIdAndPeer/:blockId/:peer', async (req, res) => {
    try {
        let block = await Block.find({ blockId: req.params.blockId, peer: req.params.peer })
        res.json(block)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//get all blocks
router.get('/', async (req, res) => {
    try {
        const blocks = await Block.find()
        res.json(blocks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//update a block
router.put('/:blockId/:peer', async (req, res) => {
    let block
    try {
        var blockToUpdate = req.params.blockId;
        await Block.updateOne({ blockId: req.params.blockId, peer: req.params.peer }, req.body);
        res.json(block)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


//delete a block
router.delete('/:blockId', getBlock, async (req, res) => {
    try {
        await res.block.remove()
        res.json({ message: 'Block Deleted!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getBlock(req, res, next) {
    let block
    try {
        block = await Block.findOne({ blockId: req.params.blockId })
        if (block == null) {
            return res.status(404).json({ message: 'block not found' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.block = block
    next()
}

module.exports = router