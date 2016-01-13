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
    JOIN_CHANNEL,
    MESSAGE_TO_CHANNEL
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

function channelStructure() {
    return {
        name: null,
        topic: null,
        messages: List(),
        users: List()
    };
}

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
                channels: state.channels,
                messages: state.messages.push({
                    message: action.payload,
                    timestamp: moment().valueOf()
                })
            }
            break;
        case JOIN_CHANNEL:

            var channels = state.channels;
            var channel = channelStructure();

            if (!channels.has(action.payload.name)) {
                channel.name = action.payload.name;
            }
            console.log("JOIN_CHANNEL: channels: " + JSON.stringify(channels.set(action.payload.channel, channel)));
            return {
                ...state,
                channels: channels.set(action.payload.channel, channel),
                activeChannel: action.payload.name,
                messages: List(),
                users: List()
            }

            break;
        case SET_CHANNEL_TOPIC: 
            console.log("SET_CHANNEL_TOPIC, payload: " + JSON.stringify(action.payload));

            var channels = state.channels;
            console.log("SET_CHANNEL_TOPIC, channels: " + JSON.stringify(channels));

            var channel = channels.get(action.payload.name);
            channel.topic = action.payload.topic;

            return {
                ...state,
                channels: channels.set(action.payload.name, channel),
                topic: action.payload.topic
            }
            break;
        case SET_CHANNEL_USERS: 
            var channel = null;
            var channels = state.channels;
            if (!channels.has(action.payload.channel)) {
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
        case MESSAGE_TO_CHANNEL:
            let userMessage = action.payload;
            console.log("MESSAGE_TO_CHANNEL: " + JSON.stringify(userMessage));
            let channel = state.channels.get(userMessage.receiver);
            channel.messages = channel.messages.push(userMessage.message);
            var messages = state.messages;
            if (channel.name == state.activeChannel) {
                messages: messages.push(userMessage.message);
            }

            return {
                ...state,
                channels: channels.set(channel.name, channel),
                messages: messages
            }
            break;
        default:
            return state;
    }
};
