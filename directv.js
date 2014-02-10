var http = require('http');
var net = require('net');


//Global variables
var globals = {
  commandNum: 0,
  listeningPort: 0,
  path1: '/remote/processKey?key=',
  path2: '&hold=keyPress',
  getCommandNum: function() {return this.commandNum;},
  incrementCommandNum: function() {this.commandNum++;},
  getListeningPort: function() {return this.listeningPort;},
  setListeningPort: function(port) {this.listeningPort = port;},
  getPath1: function() {return this.path1;},
  getPath2: function() {return this.path2;}
};


//Options for HTTP request
var options = {};


//Possible keys
var directvKeys = {
  power: true,
  poweron: true,
  poweroff: true,
  format: true,
  pause: true,
  rew: true,
  replay: true,
  stop: true,
  advance: true,
  ffwd: true,
  record: true,
  play: true,
  guide: true,
  active: true,
  list: true,
  exit: true,
  back: true,
  menu: true,
  info: true,
  up: true,
  down: true,
  left: true,
  right: true,
  select: true,
  red: true,
  green: true,
  yellow: true,
  blue: true,
  chanup: true,
  chandown: true,
  prev: true,
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  dash: true,
  enter: true
};


//Handle command line arguments
if (process.argv.length != 5) {
  console.error('Usage: ./directv.js receiver_address receiver_port port_to_listen_on');
  process.exit(1);
}  else {
  options.host = process.argv[2];
  options.port = process.argv[3];
  globals.setListeningPort(process.argv[4]);
}


//Create server to listen for commands
var server = net.createServer(function(socket) {
  globals.incrementCommandNum();
  var cn = globals.getCommandNum();
  var date = new Date();
  console.log(cn + ': Server connected: ' + date);
  //If a valid key is received call directvRequest
  socket.on('data', function(key) {
    if (directvKeys[key]) {
      console.log(cn + ': Sending key: ' + key);
      directvRequest(key, cn);
    } else {
      console.log(cn + ': Key does not exist: ' + key);
    }
  });
  socket.on('end', function() {
    var date = new Date();
    console.log(cn + ': Server disconnected: ' + date);
  });
});


//Server listens on port given in command line
server.listen(globals.getListeningPort(), 'localhost', function() {
  var date = new Date();
  console.log('Listening on port ' + globals.getListeningPort() + ': ' + date);
});


//Make a request to DirecTV box
function directvRequest(key, cn) {
 var address = globals.getPath1() + key + globals.getPath2();
 options.path = address;  
 var req = http.get(options, function(res) {
    console.log(cn + ': STATUS: ' + res.statusCode);
  }).on('error', function(err) {
    console.log(cn + ': ERROR: ' + err.message);
  });
  //Set a timeout of 10 seconds
  req.on('socket', function (socket) {
    socket.setTimeout(10000);  
    socket.on('timeout', function() {
        req.abort();
    });
  }); 
}
