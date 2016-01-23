import $ from 'jquery';

window.jQuery = require('jquery');
window.$ = window.jQuery;

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from './store';
import { Provider } from 'react-redux';
import IrcApp from './components/smart/IrcAppContainer';
import IndexPage from './components/smart/IndexPageContainer';
import LoginPage from './components/smart/LoginPageContainer';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/js/bootstrap.js');
import './client.less';

const history = createHistory();
const store = createStore(history);

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

const app = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={IrcApp}>
                <IndexRoute component={IndexPage} onEnter={requiresLogin}/>
                <Route path="login" component={LoginPage} />
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(
    app,
    document.getElementById('app')
);
