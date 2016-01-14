import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import io from 'socket.io-client';

export default class ButtonPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {channels, onButtonClick} = this.props;

        return (
            <div className="button-panel">
                {this.props.children}

                <div className="btn-group" data-toggle="buttons">
                    {channels.map((channel, i) => {
                        return (
                            <label onClick={this.onClick.bind(this, channel.name)}className="btn btn-default">
                                <input key={i}  type="radio" name="options" id="option1" autocomplete="off" checked/> {channel.name} 
                            </label>
                        )
                    })}
                </div>


  

            </div>
        );
    }

    componentDidMount() {

    }

    onClick(id) {
        console.log("id: " + id);
        console.log("ofoo: " + JSON.stringify(this.props.channels));
        this.props.onButtonClick(id);
    }
}
