const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//run when a client connects 
io.on('connection', socket => {
    console.log("new web socket connection")

    socket.emit("message", 'welcome to chat chord');
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));