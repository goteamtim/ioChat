const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server is presently running....');

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s connection(s) currently active.', connections.length);

    // Disconnect
    socket.on('disconnect', (data) => {
        if (!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsername();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s connection(s) currently active.', connections.length);
    });
    // Message
    socket.on('send message', (data) => {
        console.log(data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });
    // User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsername();
    });

    function updateUsername() {
        io.sockets.emit('get users', users);
    }
});
