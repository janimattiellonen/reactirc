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
        console.log("PROPS: " + JSON.stringify(this.props));
        
        return (
            <div className="button-panel">
                {this.props.children}

                <div className="btn-group" data-toggle="buttons">
                    <label onClick={this.onClick.bind(this, 'INFO')} className="btn btn-default">
                        <input key="0" type="radio" name="options" data-id="info" autocomplete="off" /> Info
                    </label>

                    {channels.map((channel, i) => {
                        return (
                            <IrcButton 
                                key={i} 
                                handleClick={::this.onClick}  
                                channelName={channel.name} 
                                currentChannelName={this.getCurrentChannel(channel)} 
                                newMessageOwner={this.getNewMessageOwner(channel)}/>
                        )
                    })}

                </div>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        console.log("ButtonPanel, new props");
    }

    getCurrentChannel(channel) {
        const {currentChannel} = this.props;

        return currentChannel;
    }

    getNewMessageOwner(channel) {
        const {newMessageOwner} = this.props;

        return newMessageOwner;
    }

    onClick(id) {
        if (this.state.selectedButton !== id) {
            this.props.onButtonClick(id);

            this.setState({
                selectedButton: id
            });
        }
    }
}
