// run this with: node_modules/.bin/babel-node src/cli.js to enable es6 magic!!

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

//var net = require('net');

import net from 'net';

var client = new net.Socket();
var connected = false;

process.stdin.on('data', function (input) {

	try {
		input = input.replace(/\r?\n|\r/g,"");
		let command = getCommand(input);

	    if (command == 'connect') {
	    	connect();	
	    } else if (command == "JOIN") {
	    	sendJoin(input);
		} else if (command == "NICK") {
	    	sendNick(input);
	    } else if (command == "quit") {
	    	done();
	    }
	} catch (e) {
		console.log("ERROR: " + e);
	}
    

});

client.on('data', function(data) {
	console.log("FROM SERVER: " + data);
});

function getCommand(commandStr) {
	if (commandStr.length == 0) {
		throw "No command provided";
	}

	var isIrcCommand = commandStr.indexOf("/") === 0;

	if (isIrcCommand) {
	
		var parts = parseIrcCommand(commandStr).split(" ");

		return parts[0].toUpperCase();

	} else {
		return commandStr;
	}
}

function parseIrcCommand(commandStr) {
	return commandStr.substring(1, commandStr.length);
}

function parseIrcMessage(commandStr) {
	var command = parseIrcCommand(commandStr).split(" ")[0];
	var message = commandStr.substring(command.length + 2, commandStr.length);

	return message;
}

function connect() {
	client.connect(6667, '127.0.0.1', function() {
		console.log('Connected');
	});
}

function done() {
    console.log("Quit...");
   	process.exit();
}

function write(str) {
	console.log(str);
	client.write(str + "\r\n");
}

// actual irc commands to be sent
function sendNick(cmd) {
	var nick = parseIrcMessage(cmd);
	var str = 'NICK ' + nick;
	write(str);
	sendUser(nick);
}

function sendUser(nick) {
	var str = "USER " + nick + " 8 * :My real name";
	
	write(str);
}

function sendJoin(cmd) {
	var channel = parseIrcMessage(cmd);
	var str = "JOIN " + channel;

	write(str);
}


