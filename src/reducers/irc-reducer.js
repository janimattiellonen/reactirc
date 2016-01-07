import { List, Map } from 'immutable';
import uuid from 'node-uuid';

console.log("loading irc-reducers");

import {
	INIT_CONNECTION
} from '../actions/irc-actions';

const defaultState = Map({
    io: null
});

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
        default:
            return state;

    }
};
