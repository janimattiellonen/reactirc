import axios from 'axios';
import { List } from 'immutable';
import io from 'socket.io-client';
import MessageParser from '../components/domain/MessageParser';

export const INIT_CONNECTION 		= 'INIT_CONNECTION';
export const SET_CONNECTED			= 'SET_CONNECTED';
export const RECEIVE_MESSAGE 		= 'RECEIVE_MESSAGE';

export const SET_CHANNEL_TOPIC		= 'SET_CHANNEL_TOPIC';
export const SET_CHANNEL_USERS		= 'SET_CHANNEL_USERS';
export const SET_CURRENT_CHANNEL	= 'SET_CURRENT_CHANNEL';
export const JOIN_CHANNEL			= 'JOIN_CHANNEL';

let socket = null;
let parser = new MessageParser();

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

export function processMessage(message) {

	return function (dispatch, getState) {
		if (parser.isUserCommand(message)) {
			console.log(message + ' is a user command');

			let cmd = parser.parseCommandPart(message);

			switch (cmd) {
				case 'JOIN':
					let channel = parser.parseMessagePart(message);

					dispatch(joinChannel(channel));

					return dispatch(sendMessage(message));
				break;
			}
		} else {
			console.log(message + ' is NOT a user command');
		}

		//return dispatch(sendMessage(message));
	}
/*
    Kun liitytään kanavalle /JOIN #xxx -komennolla:

	1) Lisätään ButtonPaneliin nappi
	2) Lisätään stateen uusi entry kanavalle
	3) Asetetaan kanava nykyiseksi kanavaksi
	4) Window-komponenttiin nykyisen kanavan sisältö
    5) Lähetetään komento palvelimelle
    6) Lisätään UserPaneliin käyttäjät
	
	Jos pääsy kanavalle on kielletty
	1) Tulostetaan Window-komponettiin sopiva viesti
	2) Varmistetaan, että UserPaneli on tyhjä
*/



}

export function sendMessage(message) {
    return function(dispatch, getState) {
        return getState().irc.io.emit('message', message);
    };
}

export function joinChannel(channel) {
	return function(dispatch, getState) {
		console.log("==== JOINING CHANNEL " + channel);
        return {
        	type: JOIN_CHANNEL,
        	payload: channel
        };
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

export function setCurrentChannel(channel) {
	return {
		type: SET_CURRENT_CHANNEL,
		payload: channel
	}
}