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
    console.log('Connected: %s connections are currently active.', connections.length);

    // Disconnect
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s connectoins are currently active.', connections.length);
});
