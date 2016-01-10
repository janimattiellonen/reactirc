import {List} from 'immutable';

export default class MessageParser {

	isServerCommand(str) {
		console.log('isServerCommand:' + str + '|');
		return !this.hasPrefix(str);
	}

	isServerMessage(str) {
		console.log('isServerMessage:' + str + '|');
		// :irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost :irc.example.net

		if (!this.isServerCommand(str) && !this.hasUserPrefix(str)) {
			return true;
		}

		return false;
	}

	getReplyNumber(str) {
		if (!this.isServerMessage(str)) {
			throw "Expected a server message. Got something else";
		}

		let parts = str.split(' ');

		if (parts.length < 2) {
			throw "Not enough parameters";
		}

		return parts[1];
	}

	isUserMessage(str) {
		console.log('isUserMessage:' + str + '|');
		return !this.isServerCommand(str) && !this.isServerMessage(str);
	}

	hasPrefix(str) {
		console.log('hasPrefix:' + str + '|');
		return null !== str &&str.indexOf(':') === 0;
	}

	parsePrefix(str) {
		console.log('parsePrefix:' + str + '|');
		if (!this.hasPrefix(str)) {
			throw 'Does not contain a prefix: ' + str;
		}

		let parts = str.split(' ');

		if (parts.length <= 1) {
			throw 'Not enough parameters: ' + str;
		}

		let prefix = parts[0];

		return this.removeMessageIndicator(prefix);
	}

	hasUserPrefix(str) {
		let prefix = this.parsePrefix(str);

		return prefix.indexOf('!') !== -1;
	}

	parseCommandPart(str) {
		console.log('parseCommandPart:' + str + '|');
		str = str.trim();

		str = str.substring(str.indexOf('/') === 0 ? 1 : 0, str.length);

		let pos = str.indexOf(' ');

		if (pos === -1) {
			return str;
		}

		return str.substring(0, pos);
	}

	parseMessagePart(str) {
		console.log('parseMessagePart:' + str + '|');
		let commandPart = this.parseCommandPart(str);
		console.log('parseMessagePart2:' + commandPart + '|');
		let pos = str.indexOf(' ');

		if (pos === -1) {
			return null;
		}

		let m = str.substring(commandPart.length + 1, str.length);

		console.log('mm:' + m + '|');
		return m;
	}

	parseServerFirstResponseMessage(str) {
		if (!this.isServerMessage(str)) {
			throw 'Not a server message: ' + str
		}

		let parts = str.split(' ');

		if (parts.length < 4) {
			throw 'Not enough parameters (expected at least 4): ' + str 
		}

		let serverMessageObj = {
			prefix: 		parts[0],
			replyNumber: 	parts[1],
			receiver: 		parts[2],
		};

		console.log("parseServerMessage:" + str + "|");

		str = this.removeMessageIndicator(str);
		let messageStartingPos = parts[0].length + parts[1].length + parts[2].length + 3;
		
		let messagePart = str.substring(messageStartingPos - 1, str.length);
		console.log("MESSAGEPART:" + messagePart + "|");
		serverMessageObj.message = this.removeMessageIndicator(messagePart);

		// :irc.example.net 001 jme2 :Welcome to the Internet Relay Network jme2!~jme2@localhost

		return serverMessageObj;
	}

	parseChannelTopic(str) {
		// :irc.example.net 332 jme2 #foo :Mah topic
		str = this.removeMessageIndicator(str);
		let parts = str.split(' ');
		let pos = parts[0].length + parts[1].length + parts[2].length + parts[3].length + 4;

		let topic = {
			prefix: parts[0],
			replyNumber: parts[1],
			receiver: parts[2],
			channel: parts[3],
			topic: str.substring(pos - 1, str.length)
		};

		return topic;
	}

	parseUserList(str) {
		// :irc.example.net 353 jme2 = #foo :jme2 @jme
		str = this.removeMessageIndicator(str);

		let parts = str.split(' ');

		let users = List(str.substring(str.indexOf(':') + 1, str.length).split(' ')).map(user => {
			return {
				op: user.indexOf('@') === 0,
				nick: user.replace('@', '')
			};
		}).toList();

		let info = {
			prefix: parts[0],
			replyNumber: parts[1],
			channel: str.substring(str.indexOf('#'), str.indexOf(' ', str.indexOf('#'))),
			users: users
		};	

		return info;	
	}

	removeMessageIndicator(str) {
		return str.indexOf(':') === 0 ? str.substring(1, str.length) : str;
	}
}