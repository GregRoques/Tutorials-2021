const socket = io('http://localhost:3000') //listens for where we are hosting socket application

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?');
appendMessage('You joined the party!')
socket.emit('new-user', name)

socket.on('chat-message', data=>{
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name=>{
    appendMessage(`${name} has joined the party.`)
})

socket.on('user-disconnected', name=>{
    appendMessage(`${name} has left the party.`)
})

messageForm.addEventListener('submit', e=>{
    e.preventDefault(); // prevents page from refreshing
    const message = messageInput.value;
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message); 
    messageInput.value = ''; // clear out messageInput
})

function appendMessage(message){
    const messageElement = document.createElement('div');
    messageElement.innerText = message
    messageContainer.append(messageElement)
}