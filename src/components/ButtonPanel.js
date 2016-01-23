import React from 'react';
import io from 'socket.io-client';

export default class ButtonPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedButton: null
        }
    }

    render() {

        const {channels, onButtonClick} = this.props;

        return (
            <div className="button-panel">
                {this.props.children}

                <div className="btn-group" data-toggle="buttons">
                    <label onClick={this.onClick.bind(this, 'INFO')} className="btn btn-default">
                        <input key="0" type="radio" name="options" data-id="info" autocomplete="off" /> Info
                    </label>

                    {channels.map((channel, i) => {
                        return (
                            <label onClick={this.onClick.bind(this, channel.name)}className="btn btn-default">
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
