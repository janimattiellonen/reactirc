import axios from 'axios';
import { List } from 'immutable';
import io from 'socket.io-client';

export const INIT_CONNECTION = 'INIT_CONNECTION';

export function initIoConnection() {
	console.log("initIoConnection");
	let socket = io('http://localhost:8888');
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

