import React from 'react';

export default class Topic extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {
        return (
            <div className="topic">
        		{this.getTopic()}
            </div>
        );
    }

    getTopic() {
        const {topic} = this.props;
        
        return (null == topic || topic.length == 0) ? 'No topic set' : topic;
    }
}
