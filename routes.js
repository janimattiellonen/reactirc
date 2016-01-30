import React from 'react';
import { Route, IndexRoute } from 'react-router';

import IrcApp from './components/smart/IrcAppContainer';
import IndexPage from './components/smart/IndexPageContainer';
import LoginPage from './components/smart/LoginPageContainer';


export function createRoutes({store, history}) {

	function requiresLogin(nextState, replaceState) {
	    var connected = store.getState().irc.connected;

	    if (!connected) {
	        replaceState(
	            {
	                'next': nextState.location.pathname,
	            },
	            '/login'
	        );
	    }
	}
	const routes = (
        <Route path="/" component={IrcApp}>
            <IndexRoute component={IndexPage} onEnter={requiresLogin}/>
            <Route path="login" component={LoginPage} />
        </Route>
	);

	return routes;
}