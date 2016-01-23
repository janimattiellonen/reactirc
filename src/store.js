import { createStore as reduxCreateStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { routeReducer, syncReduxAndRouter } from 'redux-simple-router';

import * as reducers from './reducers';

export function createStore(history) {
	const createStoreWithMiddleware = applyMiddleware(
	  thunk
	)(reduxCreateStore);

	const reducer = combineReducers({
		...reducers,
		routing: routeReducer
	});

	const store = createStoreWithMiddleware(reducer);

	syncReduxAndRouter(history, store);

	return store;
}