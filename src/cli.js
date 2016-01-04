// run this with: node_modules/.bin/babel-node src/cli.js to enable es6 magic!!

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

//var net = require('net');

import net from 'net';
import {CommandFactory, Command} from './components/domain/Command';

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
