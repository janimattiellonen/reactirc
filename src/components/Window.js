import React from 'react';
import {List} from 'immutable';

import {Button, ButtonGroup} from 'react-bootstrap';
//import IrcButton from './IrcButton';

export default class Window extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {

    	const {messages} = this.props;

        return (
            <div className="window">
        		{messages.map((message, i) => {
        			return (
        				<div key={i} className="message-row">
        					{message}
        				</div>
        			)
        		}) }		
            </div>
        );
    }
}

Window.defaultProps = {
	messages: List()
}