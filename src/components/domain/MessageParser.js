import {List} from 'immutable';
import _ from 'lodash';

export default class MessageParser {

	isUserCommand(str) {
		return str.indexOf('/') == 0;
	}

	isServerCommand(str) {
		return !this.hasPrefix(str);
	}

	isServerMessage(str) {
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
		return !this.isServerCommand(str) && !this.isServerMessage(str);
	}

	hasPrefix(str) {
		return null !== str &&str.indexOf(':') === 0;
	}

	parsePrefix(str) {
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
		str = str.trim();

		str = str.substring(str.indexOf('/') === 0 ? 1 : 0, str.length);

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

		return str.substring(commandPart.length + 2, str.length);;
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

		str = this.removeMessageIndicator(str);
		let messageStartingPos = parts[0].length + parts[1].length + parts[2].length + 3;
		
		let messagePart = str.substring(messageStartingPos - 1, str.length);
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
			channelName: parts[3],
			topic: str.substring(pos + 1, str.length)
		};

		return topic;
	}

	parsePartCommand(str, inline = true) {
		if (null == str) {
			throw "Invalid command, nothing given";
		}

		str = str.trim();

		let parts = str.split(' ');

		let info = {
			command: parts[0]
		};

		if (parts.length > 1) {
			info.command = parts[0];
			info.channelName = parts[1];
			info.partMessage = str.substring(parts[0].length + parts[1].length + 2, str.length);
		}

		return inline ? _.toArray(info).join(' ') : info;
	}

	parseUserList(str) {
		// :irc.example.net 353 jme2 = #foo :jme2 @jme
		str = this.removeMessageIndicator(str);

		let parts = str.split(' ');

		let users = this.parseUsers(List(str.substring(str.indexOf(':') + 1, str.length).split(' ')));

		let info = {
			prefix: parts[0],
			replyNumber: parts[1],
			channel: str.substring(str.indexOf('#'), str.indexOf(' ', str.indexOf('#'))),
			users: users
		};	

		return info;	
	}

	parseUsers(users) {
		return users.map(user => {
			return {
				op: user.indexOf('@') === 0,
				nick: user.replace('@', '')
			};
		}).toList();
	}

	removeMessageIndicator(str) {
		return str.indexOf(':') === 0 ? str.substring(1, str.length) : str;
	}

	parseUserMessage(str) {
		str = this.removeMessageIndicator(str);

		let sender = str.substring(0, str.indexOf('!'));
		let senderHost = str.substring(str.indexOf('!~') + 2, str.indexOf(' '));
		let command = str.split(' ')[1];
		let receiver = str.split(' ')[2];

		if (command == 'JOIN') {
			// for some reason JOIN messages have a ':' before the '#' (:jme!~jme@localhost JOIN :#bar)
			receiver = receiver.substring(1, receiver.length); // strip out the ':'
		}

		let message = str.substring(sender.length + senderHost.length + command.length + receiver.length + 6, str.length);

		let userMessage = {
			sender: sender,
			senderHost: senderHost,
			command: command,
			receiver: receiver,
			message: message
		};

		return userMessage;
	}
}