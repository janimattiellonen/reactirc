export class Command {
	
	parseCommandPart(str) {
		console.log("parseCommandPart:" + str + "|");
		str = str.trim();

		str = str.substring(str.indexOf("/") === 0 ? 1 : 0, str.length);

		let pos = str.indexOf(' ');

		if (pos === -1) {
			return str;
		}

		return str.substring(0, pos);
	}

	parseMessagePart(str) {
		console.log("parseMessagePart:" + str + "|");
		let commandPart = this.parseCommandPart(str);
		console.log("parseMessagePart2:" + commandPart + "|");
		let pos = str.indexOf(' ');

		if (pos === -1) {
			return null;
		}

		let m = str.substring(commandPart.length + 1, str.length);

		console.log("mm:" + m + "|");
		return m;
	}
}

export class CommandFactory {
	static create(command) {
		switch (command) {
			case 'JOIN':
				return new JoinCommand();
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
		let nick = 'NICK ' + this.parseMessagePart(str);

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
		let join = 'JOIN ' + this.parseMessagePart(str);

		return join;
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
		return 'PONG ' + this.parseMessagePart(str);
	}
}
