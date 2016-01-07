import {CommandFactory, Command, ReplyFactory, Reply} from '../components/domain/Command';

export default class IrcService {

	constructor(socket, io) {
		this.socket = socket;
		this.io 	= io;
	}

	connect() {

		this.socket.connect(6667, '127.0.0.1', () => {
			console.log('Connected');

			this.sendNick('/NICK jme2');
		});

		this.socket.on('data', (data) => {
			console.log("FROM SERVER: " + data.toString().trim() + "|");
			this.handleServerData(data.toString());
			this.io.emit('server-message', data.toString());
			// PING :irc.example.net
			// message types that the server sends to the client:
			// 1) message from another user (private message)
			// 2) message from a user to a channel the client has joined
			// 3) notices
			// 
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

	handleServerData(data) {
		let command = this.getServerMessageType(data);

		if (null != command) {
			let cmdStr = command.create(data);
			console.log("ppp: " + cmdStr);
			this.write(cmdStr);
		}
	}

	getServerMessageType(str) {
		console.log("88: " + str);
		if (null == str || str.length === 0) {
			throw "Received no data from server";
		}

		let isServerMessage = str.indexOf(':') === 0;

		if (isServerMessage) {
			return null;
		} else {
	 		let command = new Command();
	 		console.log("99");
	 		return ReplyFactory.create(command.parseCommandPart(str));
		}
	}

	getCommand(commandStr) {
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

	sendNick(cmd) {
		let uc = CommandFactory.create('NICK');
		let nickCmd = uc.create(cmd);
		this.write(nickCmd);
		this.sendUser(uc.parseMessagePart(cmd));
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