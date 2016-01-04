export class Command {
	
	parseCommandPart(str) {
		str = str.trim();
		str = str.substring(1, str.length);

		let pos = str.indexOf(' ');

		if (pos === -1) {
			return str;
		}

		return str.substring(0, pos);
	}

	parseMessagePart(str) {
		let commandPart = this.parseCommandPart(str);
		let pos = str.indexOf(' ');

		if (pos === -1) {
			return null;
		}

		return str.substring(commandPart.length + 2, str.length);
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
