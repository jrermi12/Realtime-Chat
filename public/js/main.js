const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')


//Get username and room for URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

 const socket = io();


 //Join Chat room 
 socket.emit('joinRoom' ,{ username, room});

 //Get room and users 
 socket.on("roomUsers", ({ users, room }) => {
    outputRoomName(room);
    outputUsers(users);
 })

//message form server
socket.on('message', message => {
    console.log(message)
    outputMessage(message);

    //Scroll down 
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//Message Submit 
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
   socket.emit('chatMessage',msg);

   //clear input 
   e.target.elements.msg.value ="";
   e.target.elements.msg.focus();
});


//Output Message to Dom 

function outputMessage(message){
    const div = document.createElement(('div'));
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

// add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join()}
    `
}