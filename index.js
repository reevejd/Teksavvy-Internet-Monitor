var express = require('express');
var app = express();
var request = require('request');

var port = process.env.PORT || 8080;
var server = require('http').createServer(app).listen(port, function() {
  console.log('Listening on port ', port);
});
var io = require('socket.io').listen(server)

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
})


io.on('connection', function(socket) {
    console.log('client connected');
    socket.emit('test', 'testMsg');
})