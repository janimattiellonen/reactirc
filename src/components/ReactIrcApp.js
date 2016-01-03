import React from 'react';

export default class ReactIrcApp extends React.Component {

    render() {

        return (
            <div>
                <h1>
                   ReactIrc
                </h1>

                {this.props.children}

            </div>
        );
    }

    componentDidMount() {
    
    }
}
