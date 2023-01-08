console.log("server.js is running")
const express = require('express')
const app = express()
const server = require('http').createServer(app)

const users = {}
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', socket => {

    console.log("user connect to our server with id:" + socket.id)
    socket.on('new-join', namee => {
        socket.broadcast.emit('join-noti', namee)
        users[socket.id] = namee
    })

    socket.on('send-chat-message', (data) => {
        console.log(data)
        socket.broadcast.emit("recive-message", { data: data, namee: users[socket.id] })
    })
   socket.on('disconnect',()=>{
    if(users[socket.id]!=undefined){

        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id]
    }
   })

})







server.listen(5000, () => {
    console.log("server is running on port 5000")
})
// server all the directoys (to apply the style on html)
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    console.log("get requset was made")
    res.type('html')
    res.sendFile(__dirname + '/index.html')
})
if(""!=undefined){
    console.log("mmm")
}


