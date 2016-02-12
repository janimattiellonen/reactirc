import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

export default class IrcButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			newMessage: false
		}
	}

    render() {
    	const {active, currentChannelName, channelName, newMessageOwner, handleClick} = this.props;

    	return (
	    	<label 
	    		onClick={this.onClick.bind(this, channelName)}
	            className={classNames('btn', 'btn-default', {active: channelName == currentChannelName, 'new-message': this.state.newMessage})}>
	            <input type="radio" name="options" data-id={channelName} autocomplete="off" /> {channelName}
	        </label>
    	)
    }

    componentWillReceiveProps(nextProps) {
        const {active, currentChannelName, channelName, newMessageOwner} = nextProps;

        console.log(channelName + ": currentChannelName: " + currentChannelName);
        console.log(channelName + ": newMessageOwner: " + JSON.stringify(newMessageOwner));

        if (null == this.props.newMessageOwner) {
            this.setState({
                newMessage: true
            });
        } else if (currentChannelName != channelName && newMessageOwner && channelName == newMessageOwner.receiver && this.props.newMessageOwner.ts != newMessageOwner.ts) {
            this.setState({
                newMessage: true
            });
        }
    }

    onClick(id) {
        console.log("CLICK: " + id);
    	this.setState({
    		newMessage: false
    	});

    	this.props.handleClick(id);
    }
}

IrcButton.defaultProps = {
    active: false,
    channelName: null,
    currentChannelName: null,
    newMessageOwner: null
}