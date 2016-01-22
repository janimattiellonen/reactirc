import React from 'react';

export default class IrcApp extends React.Component {

    render() {
        return (
            <div>
                <h1>RenoIRC</h1>

                {this.props.children}

            </div>
        );
    }

    componentWillMount() {
        const {initIoConnection, sendMessage} = this.props;
        initIoConnection();
    }
}
