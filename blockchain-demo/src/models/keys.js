const mongoose = require('mongoose')

const keysShcema = new mongoose.Schema({
    keysId: {
        type: Number,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    money: {
        type: String,
        required: false
    },
    to: {
        type: String,
        required: false
    }



})

module.exports = mongoose.model('Keys', keysShcema)