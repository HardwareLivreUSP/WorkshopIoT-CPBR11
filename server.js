var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var devices = [];

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('change', function (data) {
    console.log(data);
  });
  // io.emit('change', { id: 'value' });
});