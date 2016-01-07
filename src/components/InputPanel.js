import React from 'react';
import io from 'socket.io-client';

export default class InputPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="input-panel">
                <input type="text" onKeyDown={::this.onKeyDown}/>
            </div>
        );
    }

    onKeyDown(e) {
        if(e.keyCode == 13){
            let message = e.target.value;

            if (message.length > 0) {
                this.props.onSendMessage(message);
                e.target.value = "";    
            }
        }
    }

}
