import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import io from 'socket.io-client';
//import IrcButton from './IrcButton';

export default class ButtonPanel extends React.Component {

    render() {

        return (
            <div className="button-panel">
                {this.props.children}

                <ButtonGroup>
                    <Button onClick={this.onClick.bind(null, 'macintosh.fi')}>#macintosh.fi</Button>
                    <Button onClick={this.onClick.bind(null, 'mureakuha')}>#mureakuha</Button>
                    <Button onClick={this.onClick.bind(null, 'php.fi')}>#php.fi</Button>
                    <Button onClick={this.onClick.bind(null, 'frisbeegolf')}>#frisbeegolf</Button>
                </ButtonGroup>

            </div>
        );
    }

    componentDidMount() {

    }

    onClick(id) {
        var socket = io('http://localhost:8888');

        socket.emit('message', 'hello from ' + id);
    }
}
