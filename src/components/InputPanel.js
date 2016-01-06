import React from 'react';
import io from 'socket.io-client';

export default class InputPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null
        }
    }

    componentDidMount() {
        this.setState({
            socket: io('http://localhost:8888')
        });
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
                this.state.socket.emit('message', message);
                e.target.value = "";    
            }
        }
    }

}
