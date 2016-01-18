import MessageParser from './MessageParser';

export class Command {
	constructor() {
		this.parser = new MessageParser();
	}

}

export class CommandFactory {
	static create(command) {
		switch (command) {
			case 'JOIN':
				return new JoinCommand();
			case 'PART':
				return new PartCommand();
			case 'NICK': 
				return new NickCommand();
			case 'USER':
				return new UserCommand();
			default:
				throw 'Invalid command type: ' + command;
		}
	}
}

export class NickCommand extends Command {
	create(str) {
		let nick = 'NICK ' + this.parser.parseMessagePart(str);

		return nick;
	}
}

export class UserCommand extends Command {
	create(nick) {
		return "USER " + nick + " 8 * :My real name";
	}
}

export class JoinCommand extends Command {
	create(str) {
		let join = 'JOIN ' + this.parser.parseMessagePart(str);

		return join;
	}
}

export class PartCommand extends Command {
	create(str) {
		let part = 'PART ' + this.parser.parseMessagePart(str);

		return part;
	}
}

// Reply stuff

export class ReplyFactory {
	static create(type) {
		switch (type) {
			case 'PING':
				return new PongReply();
			default:
				throw "Unknown reply: " + type;

		}
	}
}

export class Reply extends Command {

}

export class PongReply extends Reply {
	create(str) {
		console.log("Creating PONG: " + str + "|");
		return 'PONG ' + this.parser.parseMessagePart(str);
	}
}
