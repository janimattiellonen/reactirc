import React from 'react';
import io from 'socket.io-client';
import classNames from 'classnames';

import IrcButton from './IrcButton';

export default class ButtonPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedButton: null
        }
    }

    render() {

        const {channels, currentChannel, newMessageOwner} = this.props;
        console.log("newMessageOwner: " + newMessageOwner);
        console.log("currentChannel: " + currentChannel);
        
        return (
            <div className="button-panel">
                {this.props.children}

                <div className="btn-group" data-toggle="buttons">
                    <label onClick={this.onClick.bind(this, 'INFO')} className="btn btn-default">
                        <input key="0" type="radio" name="options" data-id="info" autocomplete="off" /> Info
                    </label>

                    {channels.map((channel, i) => {
                        return (
                            <IrcButton key={i} handleClick={::this.onClick}  name={channel.name} currentChannel={this.getCurrentChannel(channel)} newMessageOwner={this.getNewMessageOwner(channel)}/>
                        )
                    })}
                </div>
            </div>
        );
    }

    getCurrentChannel(channel) {
        const {currentChannel} = this.props;

        let bar = currentChannel == channel.name ? currentChannel : null;

        console.log("bar: " + bar);

        return bar;
    }

    getNewMessageOwner(channel) {
        const {newMessageOwner} = this.props;

        let foo = newMessageOwner == channel.name ? newMessageOwner : null;

        console.log("foo: " + foo);

        return foo;
    }

    onClick(id) {
        console.log("ONCLICK, " + this.state.selectedButton + ",, " + id);
        if (this.state.selectedButton !== id) {
            this.props.onButtonClick(id);
            console.log("click: " + id);
            this.setState({
                selectedButton: id
            });
        }
    }
}
