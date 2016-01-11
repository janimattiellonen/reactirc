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
                    <Button key="status-button">Info</Button>
                    {channels.map((channel, i) => {
                        return (
                            <Button key={i} onClick={this.onClick.bind(this, channel.name)}>{channel.name}</Button>
                        )
                    })}
                </ButtonGroup>

            </div>
        );
    }

    componentDidMount() {

    }

    onClick(id) {

    }
}
