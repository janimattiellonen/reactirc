import uuid from 'node-uuid';
import { List } from 'immutable';

import express from 'express';
import webpack from 'webpack';

import config from '../webpack.config';
import bodyParser from 'body-parser';
import net from 'net';
const app = express();
var http = require('http').Server(app);
const compiler = webpack(config);
const port = 8888;

var io = require('socket.io')(http);

import IrcService from './services/ircService';

let client = new net.Socket()

let ircService = new IrcService(client, io);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath
}));

app.use(bodyParser.json());

app.use(require('webpack-hot-middleware')(compiler));

app.get('/api/irc', function(req, res, next) {
    res.send({
        status: 'ok'
    });
});

app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/../web/index.dev.html'));
});

/*
app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:' + port);
});
*/

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('message', function(message) {
        console.log("Message from user: " + message);
        ircService.processInput(message);
    });

    socket.on('app-command', function(message) {
        console.log('app-command: ' + message);

        if (message == 'connect') {
            console.log("Connecting to irc...");
            ircService.connect();
        }
    });
});