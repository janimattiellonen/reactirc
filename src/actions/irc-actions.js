import axios from 'axios';
import { List } from 'immutable';
import io from 'socket.io-client';
import MessageParser from '../components/domain/MessageParser';
import { pushPath } from 'redux-simple-router';


export const INIT_CONNECTION 		= 'INIT_CONNECTION';
export const SET_CONNECTED			= 'SET_CONNECTED';
export const RECEIVE_MESSAGE 		= 'RECEIVE_MESSAGE';

export const SET_CURRENT_NICK		= 'SET_CURRENT_NICK';

export const SET_CHANNEL_TOPIC		= 'SET_CHANNEL_TOPIC';
export const SET_CHANNEL_USERS		= 'SET_CHANNEL_USERS';
export const SET_CURRENT_CHANNEL	= 'SET_CURRENT_CHANNEL';
export const JOIN_CHANNEL			= 'JOIN_CHANNEL';
export const PART_CHANNEL			= 'PART_CHANNEL';
export const USER_PARTS_CHANNEL		= 'USER_PARTS_CHANNEL';
export const MESSAGE_TO_CHANNEL		= 'MESSAGE_TO_CHANNEL';

let socket = null;
let parser = new MessageParser();

export function initIoConnection() {
	return function(dispatch, getState) {
		if (null == socket || !socket.isConnected) {
			socket = io('http://localhost:8888');

			socket.on('server-message', (data) => {
				dispatch(receiveMessage(data));
			});

			socket.on('user-message', (userMessage) => {

				// let's first test this way and later on refactor
				switch (userMessage.command) {
					case 'PRIVMSG':
					// is target a channel
					if (userMessage.receiver.indexOf('#') === 0) {
						dispatch(messageToChannel(userMessage));
					} else {
						// private message to another user
					}
					break;
					case 'PART':
						dispatch(userPartsChannel(userMessage.sender, userMessage.receiver));
						break;
					case 'TOPIC':
						// userMessage: {"sender":"jme","senderHost":"jme@localhost","command":"TOPIC","receiver":"#foo","message":"Kissa"}
						dispatch(setChannelTopic({
							channelName: userMessage.receiver,
							topic: userMessage.message
						}));
						break;
					default:
						console.log("Client: unknown user message command: " + userMessage.command);
					break;
				}
				

			});

			// according to irc rfc1459, the user is allowed to join a channel, if the client receives a user list
			socket.on('channel-users', (data) => {
				dispatch(setChannelUsers(data));
			});

			socket.on('channel-topic', (data) => {
				dispatch(setChannelTopic(data));
			});

			dispatch(init(socket));
		} 
	}
}

export function init(socket) {
	return {
		type: INIT_CONNECTION,
		payload: socket
	}
}

export function setConnected(state) {
	return {
		type: 'SET_CONNECTED',
		payload: state
	}
}

export function connectToIrc(nick, host, port) {
	return function(dispatch, getState) {
		const io = getState().irc.io;
		io.emit('app-command', {
			command: 'connect',
			nick: nick,
			host: host,
			port: port
		});

		dispatch(setCurrentNick(nick));
		dispatch(setConnected(true))
		
		// this assumes connection is ok
		// we should set connection status depending on success rate

		//const { state } = getState().routing;
        //const next = state.next || '/';
        console.log("about to go to '/'");
		return dispatch(pushPath('/', {}));
	}
}

export function setCurrentNick(nick) {
	return {
		type: SET_CURRENT_NICK,
		payload: nick
	}
}

export function processMessage(message) {
	return function (dispatch, getState) {
		if (parser.isUserCommand(message)) {
			let cmd = parser.parseCommandPart(message);

			switch (cmd) {
				case 'JOIN':
					var channelName = parser.parseMessagePart(message);
					dispatch(joinChannel(channelName));
					dispatch(setCurrentChannel(channelName));
					
					return dispatch(sendMessage(message));
				break;
				case 'PART':
					var partObj = parser.parsePartCommand(message, false);
					dispatch(sendMessage(parser.parsePartCommand(message)));
					return dispatch(partChannel(partObj.channelName));
				break;
				default:
					return dispatch(sendMessage(message));
				break;
			}
		} else {
			dispatch(messageToChannel({
				message: message,
				receiver: getState().irc.activeChannel,
				sender: getState().irc.nick,
				me: true
			}));

			return dispatch(sendMessage({
				message: message,
				receiver: getState().irc.activeChannel
			}));
		}
	}
}

export function messageToChannel(userMessage) {
	return {
		type: MESSAGE_TO_CHANNEL,
		payload: userMessage
	}
}

export function sendMessage(message) {
    return function(dispatch, getState) {
        return getState().irc.io.emit('message', message);
    };
}

export function joinChannel(channelName) {
    return {
    	type: JOIN_CHANNEL,
    	payload: channelName
    };
}

export function partChannel(channelName) {
    return {
    	type: PART_CHANNEL,
    	payload: channelName
    };
}

export function userPartsChannel(nick, channelName) {
    return {
    	type: USER_PARTS_CHANNEL,
    	payload: {
    		nick: nick,
    		channelName: channelName
    	}
    };
}

export function receiveMessage(message) {
	return {
		type: RECEIVE_MESSAGE,
		payload: message
	}
}

export function setChannelTopic(data) {
	return {
		type: SET_CHANNEL_TOPIC,
		payload: data
	}
}

export function setChannelUsers(data) {
	return {
		type: SET_CHANNEL_USERS,
		payload: data
	}
}

export function setCurrentChannel(channelName) {
	return {
		type: SET_CURRENT_CHANNEL,
		payload: channelName
	}
}