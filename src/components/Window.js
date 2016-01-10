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

        return (
            <div className="window">
        		{messages.map((message, i) => 
                    <div key={i} className="message-row">
    					{moment(message.timestamp).format('HH:mm')}: {message.message}
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