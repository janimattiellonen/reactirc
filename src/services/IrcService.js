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

		this.socket.on('uncaughtException', (err) => {
			console.log("UNCAUGHT EXCEPTION: " + err);
		});

		this.socket.connect(6667, '127.0.0.1', () => {
			console.log('Connected');

			this.sendNick('/NICK jme2' + (Math.floor(Math.random() * (100 - 3)) + 100));
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

			// begins with a '/'
			if (this.parser.isUserCommand(input)) {
				let command = this.parser.parseCommandPart(input);
				console.log("command:" + command + ":");

				let func = this.createUserCommand(command);

				if (typeof this[func] == 'function') {
					this[func](input);
				} else {
					// we don't know how to process this
					console.log('Unknown command: ' + command)
				}
			} else {
				// a normal message either to a user or to a channel
				console.log("User message. NOT SUPPORTED YET: " + input);
			}
		} catch (e) {
			console.log("ERROR: " + e);
		}
	}

	createUserCommand(command) {
		return 'send' + command.toLowerCase().charAt(0).toUpperCase() + command.toLowerCase().slice(1);
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
			let serverMessageObj = this.parser.parseServerFirstResponseMessage(str);
			this.io.emit('server-message', serverMessageObj.message); // 1
			console.log("REPLY NUMBER: " + this.parser.getReplyNumber(str));
			switch (this.parser.getReplyNumber(str)) {
				case IrcConstants.RPL_WELCOME: 		// 001
				case IrcConstants.RPL_YOURHOST: 	// 002
				case IrcConstants.RPL_CREATED: 		// 003
				case IrcConstants.RPL_MYINFO: 		// 004
				case IrcConstants.RPL_BOUNCE: 		// 005s
					this.io.emit('server-message', serverMessageObj.message); // 2
					break;
				case IrcConstants.RPL_TOPIC: 		// 332

					let info = this.parser.parseChannelTopic(str);
					console.log("=====" + JSON.stringify(info));
					// :irc.example.net 332 jme2 #foo :Mah topic
					// example of how data could be sent
					// may need to serialize object as JSON
					this.io.emit('channel-topic', {
						name: info.channel,
						topic: info.topic
					});
					break;
				case IrcConstants.TOPICWHOTIME: 		// 333
					// :irc.example.net 333 jme2 #foo jme 1452279802
					break;
				case IrcConstants.RPL_NAMREPLY: 		// 353
					// :irc.example.net 353 jme2 = #foo :jme2 @jme
					let userList = this.parser.parseUserList(str);

					console.log("parsing user list: " + JSON.stringify(userList));

					this.io.emit('channel-users', userList);
					break;
				case IrcConstants.RPL_ENDOFNAMES: 	// 366
					// :irc.example.net 366 jme2 #foo :End of NAMES list
					break;
				default:
					// ignore for now
					break;
			}

			/*
				:jme2!~jme2@localhost JOIN :#foo
				:irc.example.net 332 jme2 #foo :Mah topic
				:irc.example.net 333 jme2 #foo jme 1452279802
				:irc.example.net 353 jme2 = #foo :jme2 @jme
				:irc.example.net 366 jme2 #foo :End of NAMES list
			*/

		} else if (this.parser.isUserMessage(str)) {

			console.log("======= THIS IS a user message: " + str);
			this.io.emit('server-message', str); 
			// :jme!~jme@localhost TOPIC #foo :Mah topic 
			// :jme!~jme@localhost PRIVMSG jme2 :Hey
			// :jme!~jme@localhost PRIVMSG #foo :foobar
			let userMessage = this.parser.parseUserMessage(str);
			this.io.emit('user-message', userMessage);
		} else if (this.parser.isUserPrivateMessage(str)) {
			// probably ignore this
		}

		// this.io.emit('server-message', data.toString());
	}

	write(str) {
		console.log("IrcService::write():" + str + "|");
		this.socket.write(str + "\r\n");
	}

	// rest of methods below are mapped to user commands received from a client
	// /JOIN ...
	// /NICK ...
	// etc
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


}