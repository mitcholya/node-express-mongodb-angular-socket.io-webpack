var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var routes = require('./src/server/routes');
var socket = require('./src/server/socket');

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.all('/*', function(req, res){
	res.send('\
		<!DOCTYPE html>\
		<html>\
			<head>\
				<title>Live football result</title>\
				<base href="/">\
			</head>\
			<body>\
				<div ui-view><div>\
				<script src="bundle.js"></script>\
			</body>\
		</html>\
	');
});

io.sockets.on('connection', socket);

http.listen(PORT, function(){
	console.log('Server running on ' + PORT);
});