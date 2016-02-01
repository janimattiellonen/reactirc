import React from 'react';
import classNames from 'classnames';

export default class IrcButton extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			markRead: true
		}
	}

    render() {
    	const {active, channel, currentChannel, name, newMessageOwner, handleClick} = this.props;
    	console.log(`name: ${name}, currentChannel: ${currentChannel}, markRead: ${this.state.markRead}`);
    	return (
	    	<label 
	    		onClick={this.onClick.bind(this, name)}
	            className={classNames('btn', 'btn-default', {active: name == currentChannel, 'new-message': newMessageOwner != currentChannel && !this.state.markRead})}>
	            <input type="radio" name="options" data-id={name} autocomplete="off" /> {name} 
	        </label>
    	)
    }

    componentWillReceiveProps(nextProps) {
    	console.log("IcButton1: " + JSON.stringify(this.props));
    	console.log("IcButton2: " + JSON.stringify(nextProps));

    	if (this.props.newMessageOwner != nextProps.newMessageOwner) {
    		if (nextProps.newMessageOwner == this.props.name) {
    			console.log("NEW MSG FOR THIS CHANNEL");
    			this.setState({
    				markRead: false
    			});
    		}
    	}
    }


    shouldComponentUpdate(nextProps, nextState) {
    	if (nextProps.newMessageOwner == null) {
    		return false;
    	}

    	return true;
    }


    onClick(id) {
    	console.log("ccc: " + id);
    	this.setState({
    		markRead: true
    	});

    	this.props.handleClick(id);
    }
}

IrcButton.defaultProps = {
    active: false,
    name: null,
    currentChannel: null,
    newMessageOwner: null
}