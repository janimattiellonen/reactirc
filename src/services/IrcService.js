import {CommandFactory, Command, ReplyFactory, Reply} from '../components/domain/Command';
import MessageParser from '../components/domain/MessageParser';

import * as IrcConstants from '../components/domain/constants';

import {List} from 'immutable';

const MAX_MESSAGE_LENGTH = 512;

export default class IrcService {

	constructor(client, io, socket) {
		this.client 	= client;
		this.io 		= io;
		this.socket 	= socket;
		this.parser 	= new MessageParser();
		this.command 	= new Command();
	}

	connect(nick, host, port) {

		this.client.on('uncaughtException', (err) => {
			console.log("UNCAUGHT EXCEPTION: " + err);
		});

		this.client.connect(port, host, () => {
			console.log('Connected');
;
			this.sendNick('/NICK ' + nick);
		});

		this.client.on('data', (data) => {
			console.log("FROM SERVER: " + data.toString().trim() + "|");

			data = data.toString().trim();

			let messages = List(data.match(/[^\r\n]+/g));

			messages.filter(m => m != null).map(message => this.handleServerData(message));
		});
	}

	processInput(input) {
		try {
			if (typeof input === 'object') {
				this.handleUserMessage(input);
			} else {
				input = input.replace(/\r?\n|\r/g,"");

				// begins with a '/'
				if (this.parser.isUserCommand(input)) {
					let command = this.parser.parseCommandPart(input);

					let func = this.createUserCommand(command);

					if (typeof this[func] == 'function') {
						this[func](input);
					} else {
						// we don't know how to process this
						console.log('Unknown command: ' + command)
					}
				} else {
					// a normal message either to a user or to a channel
					console.log('Unknown message type!');
				}
			}
		} catch (e) {
			console.log("ERROR: " + e);
		}
	}

	createUserCommand(command) {
		return 'send' + command.toLowerCase().charAt(0).toUpperCase() + command.toLowerCase().slice(1);
	}

	handleUserMessage(message) {
		// message.message
		// message.receiver

		this.sendPrivateMessage(message);
	}

	handleServerData(str) {
		if (str == null || str == undefined) {
			return;
		}

		if (this.parser.isServerCommand(str)) {
			// PING :irc.example.net
			let cmdStr = ReplyFactory.create(this.parser.parseCommandPart(str)).create(str);
			this.write(cmdStr);
		} else if (this.parser.isServerMessage(str)) {
			// :irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.net
			let serverMessageObj = this.parser.parseServerFirstResponseMessage(str);
			this.io.to(this.socket.id).emit('server-message', serverMessageObj.message); // 1
			switch (this.parser.getReplyNumber(str)) {
				case IrcConstants.RPL_WELCOME: 		// 001
				case IrcConstants.RPL_YOURHOST: 	// 002
				case IrcConstants.RPL_CREATED: 		// 003
				case IrcConstants.RPL_MYINFO: 		// 004
				case IrcConstants.RPL_BOUNCE: 		// 005s
					this.io.to(this.socket.id).emit('server-message', serverMessageObj.message); // 2
					break;
				case IrcConstants.RPL_TOPIC: 		// 332
					// userMessage: {"sender":"jme","senderHost":"jme@localhost","command":"TOPIC","receiver":"#foo","message":"Kissa"}
					let info = this.parser.parseChannelTopic(str);
					// :irc.example.net 332 jme2 #foo :Mah topic
					// example of how data could be sent
					// may need to serialize object as JSON
					this.io.to(this.socket.id).emit('channel-topic', {
						channelName: info.channelName,
						topic: info.topic
					});
					break;
				case IrcConstants.TOPICWHOTIME: 		// 333
					// :irc.example.net 333 jme2 #foo jme 1452279802
					break;
				case IrcConstants.RPL_NAMREPLY: 		// 353
					// :irc.example.net 353 jme2 = #foo :jme2 @jme
					let userList = this.parser.parseUserList(str);
					this.io.to(this.socket.id).emit('channel-users', userList);
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
			// this is more for debugging purposes
			this.io.to(this.socket.id).emit('server-message', str); 
			// :jme!~jme@localhost TOPIC #foo :Mah topic 
			// :jme!~jme@localhost PRIVMSG jme2 :Hey
			// :jme!~jme@localhost PRIVMSG #foo :foobar
			let userMessage = this.parser.parseUserMessage(str);
			console.log("userMessage: " + JSON.stringify(userMessage));
			this.io.to(this.socket.id).emit('user-message', userMessage);
		} else if (this.parser.isUserPrivateMessage(str)) {
			// probably ignore this
		}

		// this.io.emit('server-message', data.toString());
	}

	write(str) {
		let line = str + "\r\n";

		if (line.length > MAX_MESSAGE_LENGTH) {
			this.io.to(this.socket.id).emit('server-message', 'Message is too long ( ' + line.length +'). Exceeds limit of ' + MAX_MESSAGE_LENGTH); 
			return;
		}

		this.client.write(line);
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

	sendPart(cmd) {
		let pc = CommandFactory.create('PART');

		this.write(pc.create(cmd));
	}

	sendPrivateMessage(message) {
		this.write('PRIVMSG ' + message.receiver + ' :' + message.message);
	}
}