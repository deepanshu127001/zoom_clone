
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)

const {ExpressPeerServer} = require('peer')
const peersServer = ExpressPeerServer(server,{debug:true});

const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use('/peerjs',peersServer)

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
}); //The :room part is a placeholder for a dynamic value that will be available in the req.params object.

// io.on('connection',socket=>{
//   socket.on('join-room',()=>{console.log(`we've joined the room`);})
// })

io.on('connection', (socket) => {
  socket.on('join-room', (roomId,userId) => {
    // Join the specified room
    socket.join(roomId);
    // Emit the 'user-connected' event to all clients in the room except the sender
    socket.to(roomId).emit('user-connected',userId);
    socket.on('message',message=>{
      io.to(roomId).emit('create-message',message)
    })
  });
});


// server.listen(process.env.PORT||3030);
server.listen(8888);
