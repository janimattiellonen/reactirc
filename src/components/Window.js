import React from 'react';
import {List} from 'immutable';
import moment from 'moment';
import {Button, ButtonGroup} from 'react-bootstrap';

export default class Window extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {

    	const {messages} = this.props;
        console.log("mm: " + JSON.stringify(messages));

        return (
            <div className="window">
        		{messages.map((message, i) => 
                    <div key={i} className="message-row">
    					<span className="timestamp">{moment(message.timestamp).format('HH:mm')}</span><span className="sender">{message.sender}</span><span className="message">{message.message}</span>
    				</div>
                    ) 
                }		
            </div>
        );
    }
}

Window.defaultProps = {
	messages: List()
}