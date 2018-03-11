/**********************************************************
* WORKSHOP CAMPUS PARTY BRASIL 11
* 31/01/2018
* HARDWARE LIVRE USP
* hardwarelivreus.org
* tiny.cc/telegram-hlu
**********************************************************/

var net = require('net')
var express = require('express')
var app = express();
var httpserver = require('http').Server(app);
var io = require('socket.io')(httpserver);

// Disponibiliza arquicos públicos
app.use(express.static(__dirname + '/public/'));

// Objeto de dispositivos conectados
var devices = {};

function addDevice (id, socket) {
  if (devices[id] != undefined) {
    devices[id].socket.end();
  }
  devices[id] = {
    socket: socket,
    status: false
  }
  changeStatus (id, false);
}

function removeDevice (id) {
  if (id != null && devices[id] != undefined) {
    devices[id].socket.end();
    delete devices[id];
    io.emit('out', { id: id });
  }
}

function changeStatus (id, status) {
  if (devices[id] != undefined) {
    devices[id].status = status;
    io.emit('change', { id: id, status: status });
  }
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  socket.on('change', function (data) {
    var device = devices[data.id];
    if (device != undefined) {
      device.status = data.status;
      if (device.status) 
        device.socket.write('1\n');
      else
        device.socket.write('0\n');
    }
  });

  // envia o status e id dos dispositivos ja conectados
  for (id in devices) {
    socket.emit('change', {
      id: id,
      status: devices[id].status
    });
  }
});

var tcpserver = net.createServer((socket) => {
  var id = null;

  socket.setKeepAlive(true, 1000);
  socket.setTimeout(1000);
  socket.on('timeout', () => {
    console.log('timeout')
    removeDevice(id);
    socket.end();
  });

  socket.on('data', function(data) {
    data = data.toString('ascii');
    data = data.split('\n')[0];
    // console.log(data);
    if (data.length >= 2 && data.slice(0,2) == 'id'&& id == null) {
      var idtmp = data.slice(2, data.length);
      if (id == '') return;
      id = idtmp.replace(/[^a-z0-9\-]/gi,'');
      if (devices[id] != undefined) delete devices[id];
      addDevice(id, socket);
    } else if (id != null && data.length == 1) {
      // recebe confirmação de status
      if (data == "1") changeStatus(id, true);
      else if (data == "0") changeStatus(id, false);
    }
  })

  socket.on('close', () => {
    console.log('close')
    removeDevice(id);
  });

  socket.on('end', () => {
    console.log('end');
    removeDevice(id);
  });

  socket.on('error', (error) => {
    socket.end();
  });

});

tcpserver.on('error', (e) => {
  console.log(e)
});

// Inicia servidores
tcpserver.listen(8000);
httpserver.listen(80);