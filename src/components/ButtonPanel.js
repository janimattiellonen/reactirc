import React from 'react';
import io from 'socket.io-client';
import classNames from 'classnames';

export default class ButtonPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedButton: null
        }
    }

    render() {

        const {channels, onButtonClick, currentChannel} = this.props;

        return (
            <div className="button-panel">
                {this.props.children}

                <div className="btn-group" data-toggle="buttons">
                    <label onClick={this.onClick.bind(this, 'INFO')} className="btn btn-default">
                        <input key="0" type="radio" name="options" data-id="info" autocomplete="off" /> Info
                    </label>

                    {channels.map((channel, i) => {
                        return (
                            <label onClick={this.onClick.bind(this, channel.name)} className={classNames('btn', 'btn-default', {active: channel.name == currentChannel})}>
                                <input key={i} type="radio" name="options" data-id={channel.name} autocomplete="off" /> {channel.name} 
                            </label>
                        )
                    })}
                </div>
            </div>
        );
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
