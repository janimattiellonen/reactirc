import uuid from 'node-uuid';
import { List, Map} from 'immutable';

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

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.join(socket.id);
    var ircService = null;

    socket.on('message', function(message) {
        ircService.processInput(message);
    });

    socket.on('app-command', function(data) {

        console.log('app-command: ' + JSON.stringify(data));

        if (data.command == 'connect') {
            var client = new net.Socket();
            ircService = new IrcService(client, io, socket);
            console.log("Connecting to irc...");
            ircService.connect(data.nick, data.host, data.port);
        }
    });
});

