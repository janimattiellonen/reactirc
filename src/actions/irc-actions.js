import axios from 'axios';
import { List } from 'immutable';
import io from 'socket.io-client';

export const INIT_CONNECTION 	= 'INIT_CONNECTION';
export const RECEIVE_MESSAGE 	= 'RECEIVE_MESSAGE';

export const OPEN_NEW_CHANNEL	= 'OPEN_NEW_CHANNEL';
export const SET_CHANNEL_TOPIC	= 'SET_CHANNEL_TOPIC';

export function initIoConnection() {
	return function(dispatch, getState) {
		console.log("initIoConnection");
		let socket = io('http://localhost:8888');

		socket.on('server-message', (data) => {
			console.log("Server responded with: " + data);

			dispatch(receiveMessage(data));
		});

		socket.on('channel-topic', (data) => {
			console.log("Server responded with: " + JSON.stringify(data));

			//		dispatch(receiveMessage(data));
			dispatch(setChannelTopic(data));
		});

		dispatch(init(socket));
	}

/*
	return {
		type: INIT_CONNECTION,
		payload: socket
	}
*/
}

export function init(socket) {
	return {
		type: INIT_CONNECTION,
		payload: socket
	}
}

export function connectToIrc() {
	console.log("connectToIrc");

	return function(dispatch, getState) {
		console.log("connectToIrc 2");
		return getState().irc.io.emit('app-command', 'connect');
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