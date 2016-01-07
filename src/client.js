import $ from 'jquery';

window.jQuery = require('jquery');
window.$ = window.jQuery;

import './client.less';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import IrcApp from './components/smart/IrcAppContainer';
import IndexPage from './components/smart/IndexPageContainer';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/js/bootstrap.js');

const app = (
    <Provider store={store}>
        <Router history={createHistory()}>
            <Route path="/" component={IrcApp}>
                <IndexRoute component={IndexPage}/>
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(
    app,
    document.getElementById('app')
);

