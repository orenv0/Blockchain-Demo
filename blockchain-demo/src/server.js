const express = require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://orenv0:12345@cluster0.tmrqg.mongodb.net/FINAL?retryWrites=true&w=majority', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(express.json())
const blockRouter = require('./routes/blocks')
const keysRouter = require('./routes/keys')
app.use('/blocks', blockRouter)
app.use('/keys', keysRouter)
app.listen(8080, () => console.log('Server Started'))