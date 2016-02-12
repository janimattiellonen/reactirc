import React from 'react';

export default class IrcApp extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}

            </div>
        );
    }

    componentWillMount() {
        const {initIoConnection, sendMessage} = this.props;
        initIoConnection();
    }
}
