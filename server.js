const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const e = require('express');
const formatMessage = require('./utils/message');
const app = express();
const server = http.createServer(app)
const io = socketio(server);
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/user')

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatChord Bot';
//run when a client connects 
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id,username, room);
        
        socket.join(user.room)
    
        //WeLcome to chaT chord
    socket.emit("message", formatMessage(botName,'welcome to chat chord'));
    
        //broadcast when a user connects 
    socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} has joined the chat`));

    //Send users and room info 

    io.to(room).emit("roomUsers", {
        room:user.room,
        users:getRoomUsers(user.room)
    })
    });
   
    //listen for chat message 
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    });
      //runs when client disconnect 
    socket.on('disconnect',({ username, room }) => {
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left chat`));

            io.to(room).emit("roomUsers", {
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
      });
    });

    const PORT = 3000 || process.env.PORT;

    server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));