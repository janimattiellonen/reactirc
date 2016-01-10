import { List, Map} from 'immutable';
import uuid from 'node-uuid';
import moment from 'moment';

console.log("loading irc-reducers");

import {
	INIT_CONNECTION,
    SET_CONNECTED,
    RECEIVE_MESSAGE,
    OPEN_NEW_CHANNEL,
    SET_CHANNEL_TOPIC,
    SET_CHANNEL_USERS
} from '../actions/irc-actions';

const defaultState = {
    io: null,
    messages: List(),
    channels: Map(),
    users: List(),
    activeChannel: null,
    connected: false
};


export default function(state = defaultState, action) {
	console.log("type: " + action.type)
    switch (action.type) {
    	case INIT_CONNECTION:
    		console.log("irc-reducers:INIT_CONNECTION");
    		return {
                //state: state.update('io', io => action.payload),
                ...state,
                io: action.payload
            }
    		break;
        case SET_CONNECTED: 
            console.log("===== " + action.payload);
            return {
                ...state,
                connected: action.payload
            }
            break;
        case RECEIVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.push({
                    message: action.payload,
                    timestamp: moment().valueOf()
                })
            }
            break;
        case OPEN_NEW_CHANNEL:
            return {
                ...state,
                channels: channels.set(action.payload.channel.name, action.payload.channel),
                activeChannel: action.payload.channel
            }
            break;
        case SET_CHANNEL_TOPIC: 

            var channel = null;
            var channels = state.channels;
            console.log("SET_CHANNEL_TOPIC: " + JSON.stringify(action.payload));
            if (!channels.has(action.payload.name)) {
                console.log("No entry for " + action.payload.name);
                channel = {
                    name: action.payload.name,
                    topic: action.payload.topic
                }
            } else {
                console.log("Entry found for: " + action.payload.name);
                channel = channels.get(action.payload.name);
                channel.topic = action.payload.name;
            }

            channels = channels.set(action.payload.name, channel);
            console.log("CHANNELS NOW: " + JSON.stringify(channels));
            return {
                ...state,
                channels: channels
            }
            break;
        case SET_CHANNEL_USERS: 
            var channel = null;
            var channels = state.channels;

            if (!channels.has(action.payload.channel)) {
                console.log("No entry for " + action.payload.channel);
                channel = {
                    name: action.payload.channel,
                    users: action.payload.users
                }
            }

            channels = channels.set(action.payload.channel, channel);

            return {
                ...state,
                channels: channels,
                users: List(action.payload.users)
            }
            break;
        default:
            console.log("RETURNING default state: " + JSON.stringify(state));
            return state;

    }
};
