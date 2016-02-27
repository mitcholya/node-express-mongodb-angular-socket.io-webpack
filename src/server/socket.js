var fs = require('fs');

function sendData(socket){
		var data = fs.readFileSync('./src/server/db/matches.json', 'utf8');
	  	console.log(data);
	  	socket.emit('message', data);
}

module.exports = function (socket) {
	
	sendData(socket);

	setInterval(function() {
		sendData(socket);
	}, 10000);
    

};