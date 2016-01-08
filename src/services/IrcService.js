import {CommandFactory, Command, ReplyFactory, Reply} from '../components/domain/Command';
import MessageParser from '../components/domain/MessageParser';

import * as IrcConstants from '../components/domain/constants';

import {List} from 'immutable';

export default class IrcService {

	constructor(socket, io) {
		this.socket 	= socket;
		this.io 		= io;
		this.parser 	= new MessageParser();
		this.command 	= new Command();
	}

	connect() {

		this.socket.connect(6667, '127.0.0.1', () => {
			console.log('Connected');

			this.sendNick('/NICK jme2');
		});

		this.socket.on('data', (data) => {
			console.log("FROM SERVER: " + data.toString().trim() + "|");

			data = data.toString().trim();

			let messages = List(data.match(/[^\r\n]+/g));

			console.log("messages length: " + messages.length);

			console.log("messages: " + messages);

			messages.filter(m => m != null).map(message => this.handleServerData(message));

		

		

			//this.handleServerData(data.toString());
			//this.io.emit('server-message', data.toString());
			// PING :irc.example.net
			// message types that the server sends to the client:
			// 1) message from another user (private message)
			// 2) message from a user to a channel the client has joined
			// 3) action done by another user:
			// 		:jme!~jme@localhost TOPIC #foo :Mah topic 	
			// 4) action done by the server
			// 		:irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.Network
		});
	}

	processInput(input) {
		try {
			input = input.replace(/\r?\n|\r/g,"");

			let command = this.getCommand(input);
			console.log("cc:" + command + ":");

		    if (command == "JOIN") {
		    	this.sendJoin(input);
			} else if (command == "NICK") {
		    	this.sendNick(input);
		    } else if (command == "quit") {
		    	// not yet implemented
		    } else if (input.indexOf("=") === 0) {
		    	// we are simulating server messages
		    	this.handleServerData(input.substring(1, input.length));
		    }
		} catch (e) {
			console.log("ERROR: " + e);
		}
	}

	handleServerData(str) {
		if (str == null || str == undefined) {
			return;
		}

		console.log('handleServerData:' + str + '|')
		if (this.parser.isServerCommand(str)) {
			// PING :irc.example.net
			let cmdStr = ReplyFactory.create(this.parser.parseCommandPart(str)).create(str);
			this.write(cmdStr);
		} else if (this.parser.isServerMessage(str)) {
			// :irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.net
			let serverMessageObjMock = {
				prefix: 'irc.example.net',
				replyNumber: '001',
				receiver: 'jme2', // may be a channel too (#foo)
				message: 'Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.net'
			};

			let serverMessageObj = this.parser.parseServerMessage(str);

			this.io.emit('server-message', serverMessageObj.message);


		} else if (this.parser.isUserMessage(str)) {
			// :jme!~jme@localhost TOPIC #foo :Mah topic 
		} else if (this.parser.isUserPrivateMessage(str)) {
			// :jme!~jme@localhost PRIVMSG jme2 :Hey
		}

		// this.io.emit('server-message', data.toString());

/*

		let command = this.getServerMessageType(data);

		if (null != command) {
			let cmdStr = command.create(data);
			console.log("ppp: " + cmdStr);
			this.write(cmdStr);
		}
*/
	}

	getServerMessageType(str) {
		let command = new Command();
		console.log("88: " + str);

		if (null == str || str.length === 0) {
			throw "Received no data from server";
		}

		let isMessage = str.indexOf(':') === 0;

		if (isMessage) {

			let hasUserPrefix = this.parser.hasUserPrefix(str);


			// :irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.net
			// :jme!~jme@localhost TOPIC #foo :Mah topic 



			return null;
		} else {
	 		
	 		console.log("99");
	 		return ReplyFactory.create(this.parser.parseCommandPart(str));
		}
	}

	getCommand(commandStr) {
		let c = new Command();

		if (commandStr.length == 0) {
			throw "No command provided";
		}

		var isIrcCommand = commandStr.indexOf("/") === 0;

		if (isIrcCommand) {
			return this.parser.parseCommandPart(commandStr);
		} else {
			return commandStr;
		}
	}

	sendNick(cmd) {
		let uc = CommandFactory.create('NICK');
		let nickCmd = uc.create(cmd);
		this.write(nickCmd);
		this.sendUser(this.parser.parseMessagePart(cmd));
	}

	sendUser(nick) {
		let uc = CommandFactory.create('USER');
		
		this.write(uc.create(nick));
	}

	sendJoin(cmd) {
		let jc = CommandFactory.create('JOIN');

		this.write(jc.create(cmd));
	}

	write(str) {
		console.log("IrcService::write():" + str + "|");
		this.socket.write(str + "\r\n");
	}
}