import axios from 'axios';
import { List } from 'immutable';
import io from 'socket.io-client';

export const INIT_CONNECTION 	= 'INIT_CONNECTION';
export const SET_CONNECTED		= 'SET_CONNECTED';
export const RECEIVE_MESSAGE 	= 'RECEIVE_MESSAGE';

export const OPEN_NEW_CHANNEL	= 'OPEN_NEW_CHANNEL';
export const SET_CHANNEL_TOPIC	= 'SET_CHANNEL_TOPIC';
export const SET_CHANNEL_USERS	= 'SET_CHANNEL_USERS';

let socket = null;

export function initIoConnection() {
	return function(dispatch, getState) {
		console.log("initIoConnection");

		if (null == socket || !socket.isConnected) {
			socket = io('http://localhost:8888');

			socket.on('server-message', (data) => {
				console.log("Server responded with: " + data);

				dispatch(receiveMessage(data));
			});

			// according to irc rfc1459, the user is allowed to join a channel, if the client receives a user list
			socket.on('channel-users', (data) => {
				dispatch(setChannelUsers(data));
			});

			socket.on('channel-topic', (data) => {
				console.log("channel-topic: " + JSON.stringify(data));

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

export function connectToIrc() {
	return function(dispatch, getState) {
		const io = getState().irc.io;

		io.emit('app-command', 'connect');

		return dispatch(setConnected(true));
	}
}

export function sendMessage(message) {
    return function(dispatch, getState) {

        return getState().irc.io.emit('message', message);
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