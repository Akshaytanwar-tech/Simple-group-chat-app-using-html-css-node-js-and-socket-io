const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// const removeuser = require('../user/users');

const users = {};

app.use(express.static(path.join(__dirname, '../public')));

io.on("connection", socket => {
    socket.on('new-user-joined', name => {
        console.log(name);
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
        io.emit('user-list', users);
        // io.to(users[socket.id]).emit("")
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
        io.to(users[socket.id]).emit("recieve", { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
        io.emit('user-list', users);
    });
});


httpServer.listen(3000);