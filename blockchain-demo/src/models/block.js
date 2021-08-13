const mongoose = require('mongoose')

const blockShcema = new mongoose.Schema({
    blockId: {
        type: Number,
        required: true
    },
    blockNumber: {
        type: Number,
        required: true
    },
    nonce: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: false
    },
    coinbase: {
        type: String,
        required: false
    },
    tx: [{
        type: String,
        required: false
    }],
    coinbase: {
        type: String,
        required: false
    },
    prev: {
        type: String,
        required: false
    },
    hash: {
        type: String,
        required: true
    },
    peer: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        required: true
    },


})

module.exports = mongoose.model('Block', blockShcema)