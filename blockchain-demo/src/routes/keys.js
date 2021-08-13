const express = require('express')
const Keys = require('../models/keys')
const router = express.Router()



router.post('/', async (req, res) => {
    const keys = new Keys({
        keysId : req.body.keysId,
        privateKey : req.body.privateKey,
        publicKey : req.body.publicKey,
        message : req.body.message
    })
    try {
        const newKey = await keys.save()
        res.json(newKey)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
router.get('/byKeysId/:keysId', async(req, res) => {
    let keys
    try {
        keys = await Keys.findOne({keysId: req.params.keysId })
        res.json(keys)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})
router.put('/:keysId', async (req, res) => {
    let keys
    try{
       keys = await Keys.updateOne({ keysId: req.params.keysId }, req.body);
       res.json(keys)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})
module.exports = router