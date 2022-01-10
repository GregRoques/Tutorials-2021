const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true
    }
}) 
httpServer.listen(3000)

let users = {}

io.on('connection', socket => { // everytime a user loads up this website, it runs this function and gives each user their own socket
    socket.on('new-user', name =>{
        users[socket.id] = name; //all sockets have a unique id
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', {
            message,
            name: users[socket.id]
        })
    })
    socket.on('disconnect', () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})