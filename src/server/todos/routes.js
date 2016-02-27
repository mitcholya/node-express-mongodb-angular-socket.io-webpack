var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
	//console.log(data);
	var data = fs.readFileSync('./src/server/db/matches.json', 'utf8');
	res.json(data);
});

module.exports = router;