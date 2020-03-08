var express = require('express');
var app = express();

// Import the socket.io library
const io = require('socket.io')(); // Instantiate the library right away with the () method -> makes it run

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// This is all of our socket.io messaging functionality

// Attach socket.io
io.attach(server);

io.on('connection', function(socket) {
    console.log('User connected');
    socket.emit('connected', { sID: `${socket.id}`, message: 'New Connection', count: io.engine.clientsCount - 1 });
    io.emit('new_user');

    // Listen for an incoming message from a user (socket refers to an individual user)
    // msg is the incoming message from that user
    socket.on('chat_message', function(msg) {
        console.log(msg);

        // When we get a new message, send it to everyone so they see it
        // io is the switchboard operator, making sure everyone who's connected gets the message.
        io.emit('new_message', { id: socket.id, message: msg});
    })

    // Listen for disconnect event
    socket.on('disconnect', function() {
        console.log('A user disconnected');

        message = `${socket.id} has left the chat.`;
        io.emit('user_disconnect', message);
    })
})