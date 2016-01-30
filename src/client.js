import $ from 'jquery';

window.jQuery = require('jquery');
window.$ = window.jQuery;

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from './store';
import { createApp } from './util/app';
import { Provider } from 'react-redux';
import IrcApp from './components/smart/IrcAppContainer';
import IndexPage from './components/smart/IndexPageContainer';
import LoginPage from './components/smart/LoginPageContainer';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import * as reducers from './reducers';

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/js/bootstrap.js');
import './client.less';

const history = createHistory();
const store = createStore(reducers, history);


import { createRoutes } from './routes';


const routes = createRoutes({
    store,
    history
});

const app = createApp(store, history, routes);

ReactDOM.render(
    app,
    document.getElementById('app')
);
