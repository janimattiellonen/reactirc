import { List, Map} from 'immutable';
import uuid from 'node-uuid';
import moment from 'moment';
import _ from 'lodash';

import {
	INIT_CONNECTION,
    SET_CONNECTED,
    SET_CURRENT_NICK,
    RECEIVE_MESSAGE,
    SET_CHANNEL_TOPIC,
    SET_CHANNEL_USERS,
    SET_CURRENT_CHANNEL,
    JOIN_CHANNEL,
    PART_CHANNEL,
    MESSAGE_TO_CHANNEL,
    USER_PARTS_CHANNEL
} from '../actions/irc-actions';

const defaultState = {
    io: null,
    messages: List(),
    channels: Map(),
    users: List(),
    nick: null,
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

function sortUsers(users) {
    return _.sortByOrder(users, ['nick']);
}

function compare(a, b) {
    if (a.nick < b.nick) {
        return -1;
    } else if (a.nick > b.nick){
        return 1;
    } else {
        return 0;
    }
}

export default function(state = defaultState, action) {
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
        case SET_CURRENT_NICK:
            return {
                ...state,
                nick: action.payload
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
            var channel = channelStructure();

            if (!channels.has(action.payload)) {
                channel.name = action.payload;
            }
           
            return {
                ...state,
                channels: channels.set(action.payload, channel),
                activeChannel: action.payload,
                messages: List(),
                users: List(),
                topic: state.topic
            }

            break;
        case PART_CHANNEL:
            var channels = state.channels;
            var channel = action.payload;
            var activeChannel = null;
            var topic = null;
            var users = List();
            var messages = List();

            channels = channels.remove(channel);

            if (channels.count() > 0) {
                var lastChannel = channels.last();
                activeChannel = lastChannel.name;
                messages = lastChannel.messages;
                users = lastChannel.users;
                topic = lastChannel.topic;
            }

            return {
                ...state,
                channels: channels.remove(channel),
                activeChannel: activeChannel,
                messages: messages,
                users: users,
                topic: topic
            }

            break;
        case USER_PARTS_CHANNEL:
            console.log(USER_PARTS_CHANNEL + ": " + JSON.stringify(action.payload));
            console.log(USER_PARTS_CHANNEL + " 2: " + JSON.stringify(action.payload.nick));
            var channels = state.channels;
            var channel = channels.get(action.payload.channelName);

            channel.users = channel.users.filter(user => user.nick != action.payload.nick);
            console.log("ooo: " + JSON.stringify(channel.users));

            return {
                ...state,
                channels: channels.set(action.payload.channelName, channel),
                users: channel.users
            }

            break;
        case SET_CHANNEL_TOPIC: 
            var channels = state.channels;
            var channel = channels.get(action.payload.channelName);
            channel.topic = action.payload.topic;

            return {
                ...state,
                channels: channels.set(action.payload.channelName, channel),
                topic: action.payload.topic
            }
            break;
        case SET_CHANNEL_USERS: 
            var channel = null;
            var channels = state.channels;
            console.log("bba: " + JSON.stringify(action.payload));
            console.log("bb: " + action.payload.channel);
            console.log("JJJ: " + JSON.stringify(channels));

            var users = List(action.payload.users.sort(compare));

            channel = channels.get(action.payload.channel)
            channel.users = users;
            channels = channels.set(action.payload.channel, channel);

            return {
                ...state,
                channels: channels,
                users: users
            }
            break; 
        case SET_CURRENT_CHANNEL:

            var channel = state.channels.get(action.payload);
            console.log("channel: " + JSON.stringify(channel));
            return {
                ...state,
                activeChannel: action.payload,
                messages: channel.messages,
                users: channel.users,
                topic: channel.topic
            }
            break;
        case MESSAGE_TO_CHANNEL:
            let userMessage = action.payload;

            var channel = state.channels.get(userMessage.receiver);
            var messages = state.messages;
            var newMessage = {
                message: userMessage.message,
                timestamp: moment().valueOf(),
                sender: userMessage.sender,
                me: userMessage.me != null && userMessage.me == true
            };

            channel.messages = channel.messages.push(newMessage);

            if (channel.name == state.activeChannel) {
                messages = channel.messages;
            }

            return {
                ...state,
                channels: state.channels.set(channel.name, channel),
                messages: messages
            }
            break;
        default:
            return state;
    }
};
