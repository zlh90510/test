var net = require('net');

const HOST = '127.0.0.1';

const PORT = 18001;

var tcpCliecnt = net.Socket();

tcpCliecnt.connect(PORT,HOST, function () {
    console.log('connected success');
    tcpCliecnt.write('this is tcp client by node.js')
});

tcpCliecnt.on('data',function (data) {
    console.log('received:', data.toString());
});
