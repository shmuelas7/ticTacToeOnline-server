const express = require('express'),
    app = express(),
    PORT = 2501,
    cors = require('cors');

app.use(cors())
app.use(express.json())

const http = require('http')
const server = http.createServer(app)

const socket = require('socket.io')
const io = new socket.Server(server, {
    cors: {
        origin: '*'
    }
})

require('./socket')(io);




server.listen(PORT, () => console.log("##### Server is UP #####"))