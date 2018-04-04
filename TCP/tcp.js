var net = require('net');

const PORT = 18001;
const HOST = '127.0.0.1';

var clientHandler = function (socket) {
    console.log('someone connected');
    socket.on('data', function dataHandler(data) {
        console.log('client Address: ', socket.remoteAddress, ' Port: ', socket.remotePort, 'send: ', data.toString());
        socket.write('server received!');
    });

    socket.on('close', function () {
        console.log('client Address: ', socket.remoteAddress, ' Port: ', socket.remotePort, 'disconnected');
    })

};

var app = net.createServer(clientHandler);

app.listen(PORT, HOST);