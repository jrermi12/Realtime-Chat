const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const e = require('express');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//run when a client connects 
io.on('connection', socket => {
    socket.emit("message", 'welcome to chat chord');
    //broadcast when a user connects 
    socket.broadcast.emit('message', "A user has joined the chat");

    //runs when client disconnect 
    socket.on('disconnect',() => {
        io.emit('message','A user has left chat')
    });

    //listen for chat message 
    socket.on('chatMessage',(msg)=>{
        console.log(msg)
        io.emit('message',msg)
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));