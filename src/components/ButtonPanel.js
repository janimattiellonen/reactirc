import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import io from 'socket.io-client';

export default class ButtonPanel extends React.Component {

    render() {

        const {channels} = this.props;

        return (
            <div className="button-panel">
                {this.props.children}

                <ButtonGroup>
                    {channels.map((channel, i) => {
                        return (
                            <Button key={i} onClick={this.onClick.bind(null, channel.name)}>{channel.name}</Button>
                        )
                    })}
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
