const socket = io();
const chatform = document.getElementById('chat-form')
socket.on('message', message => {
    console.log(message)
})