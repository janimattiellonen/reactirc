// run this with: node_modules/.bin/babel-node src/cli.js to enable es6 magic!!

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

import net from 'net';
import {CommandFactory, Command, ReplyFactory, Reply} from './components/domain/Command';

var client = new net.Socket();
var connected = false;
let receivedData = "";


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
	    } else if (input.indexOf("=") === 0) {
	    	// we are simulating server messages
	    	handleServerData(input.substring(1, input.length));
	    }
	} catch (e) {
		console.log("ERROR: " + e);
	}
});

client.on('data', function(data) {
	console.log("FROM SERVER: " + data.toString().trim() + "|");
	handleServerData(data.toString());
	// PING :irc.example.net


	// message types that the server sends to the client:
	// 1) message from another user (private message)
	// 2) message from a user to a channel the client has joined
	// 3) notices
	// 

	
});

client.on('end', function() {
	console.log("Connection to irc closed");
})

function handleServerData(data) {
	let command = getServerMessageType(data);

	if (null != command) {
		write(command.create(data));
	}
}

function getServerMessageType(str) {
	console.log("88: " + str);
	if (null == str || str.length === 0) {
		throw "Received no data from server";
	}

	let isServerMessage = str.indexOf(':') === 0;

	if (isServerMessage) {
		return null;
	} else {
 		let command = new Command();
 		return ReplyFactory.create(command.parseCommandPart(str));
	}
}

function getCommand(commandStr) {
	let c = new Command();

	if (commandStr.length == 0) {
		throw "No command provided";
	}

	var isIrcCommand = commandStr.indexOf("/") === 0;

	if (isIrcCommand) {
		return c.parseCommandPart(commandStr);
	} else {
		return commandStr;
	}
}

function connect() {
	client.connect(6667, '127.0.0.1', function() {
		console.log('Connected');

		sendNick('/NICK jme2');
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
	let uc = CommandFactory.create('NICK');
	let nickCmd = uc.create(cmd);
	write(nickCmd);
	sendUser(uc.parseMessagePart(cmd));
}

function sendUser(nick) {
	let uc = CommandFactory.create('USER');
	
	write(uc.create(nick));
}

function sendJoin(cmd) {
	let jc = CommandFactory.create('JOIN');

	write(jc.create(cmd));
}
