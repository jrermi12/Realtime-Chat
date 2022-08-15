const socket = io();
const chatform = document.getElementById('chat-form')
socket.on('message', message => {
    console.log(message)
})

//Message Submit 
chatform.addEventListener('submit', e=>{
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
   socket.emit('chat-message',msg);
})