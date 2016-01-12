import React from 'react';

export default class Topic extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {

    	const {topic} = this.props;

        return (
            <div className="topic">
        		{topic}
            </div>
        );
    }
}

Window.defaultProps = {
	topic: 'No topic set'
}