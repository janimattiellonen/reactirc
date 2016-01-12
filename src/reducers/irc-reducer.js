import { List, Map} from 'immutable';
import uuid from 'node-uuid';
import moment from 'moment';

console.log("loading irc-reducers");

import {
	INIT_CONNECTION,
    SET_CONNECTED,
    RECEIVE_MESSAGE,
    SET_CHANNEL_TOPIC,
    SET_CHANNEL_USERS,
    SET_CURRENT_CHANNEL,
    JOIN_CHANNEL
} from '../actions/irc-actions';

const defaultState = {
    io: null,
    messages: List(),
    channels: Map(),
    users: List(),
    currentChannel: null,
    connected: false,
    topic: null
};


export default function(state = defaultState, action) {
	console.log("type: " + action.type)
    switch (action.type) {
    	case INIT_CONNECTION:
    		return {
                ...state,
                io: action.payload
            }
    		break;
        case SET_CONNECTED: 
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
        case JOIN_CHANNEL:

            var channels = state.channels;
            var channel = null;

            if (!channels.has(action.payload.name)) {
                channel = {
                    name: action.payload.name,
                    topic: '',
                    users: List()
                }
            }

            return {
                ...state,
                channels: channels.set(action.payload.channel, channel),
                activeChannel: action.payload.name
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
                channel.topic = action.payload.topic;
            }

            channels = channels.set(action.payload.name, channel);
            console.log("CHANNELS NOW: " + JSON.stringify(channels));
            return {
                ...state,
                channels: channels,
                topic: action.payload.topic
            }
            break;
        case SET_CHANNEL_USERS: 
            var channel = null;
            var channels = state.channels;
            console.log("SET_CHANNEL_USERS: payload: " + JSON.stringify(action.payload));
            if (!channels.has(action.payload.channel)) {
                console.log("No entry for " + action.payload.channel);
                channel = {
                    name: action.payload.channel,
                    users: action.payload.users
                }
            } else {
                channel = channels.get(action.payload.channel);
            }

            channels = channels.set(action.payload.channel, channel);
            console.log("SET_CHANNEL_USERS, channels: " + JSON.stringify(channels));
            return {
                ...state,
                channels: channels,
                users: List(action.payload.users)
            }
            break;
        case SET_CURRENT_CHANNEL:
            return {
                ...state,

            }
            break;
        default:
            console.log("RETURNING default state: " + JSON.stringify(state));
            return state;

    }
};
