import { List, Map, OrderedSet} from 'immutable';
import uuid from 'node-uuid';

console.log("loading irc-reducers");

import {
	INIT_CONNECTION,
    RECEIVE_MESSAGE,
    OPEN_NEW_CHANNEL,
    SET_CHANNEL_TOPIC
} from '../actions/irc-actions';

const defaultState = {
    io: null,
    messages: OrderedSet(),
    channels: Map(),
    activeChannel: null
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
        case RECEIVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.add(action.payload)
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

            let channel;
            let channels = state.channels;
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
        default:
            return state;

    }
};
