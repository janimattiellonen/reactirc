import React from 'react';
import {Button} from 'react-bootstrap';
import ButtonPanel from './ButtonPanel';
import UserPanel from './UserPanel';
import Window from './Window';
import LoginWindow from './LoginWindow';
import InputPanel from './InputPanel';
import Topic from './Topic';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {connected} = this.props;

        return (    
            <div className="component">
                
                {this.renderContents()}
            </div>
        );
    }

    renderContents() {
        const {connected} = this.props;

        if (connected) {
            return this.renderIrcWindow();
        } else {
            return this.renderLoginWindow();
        }
    }

    renderIrcWindow() {
        const {processMessage, setCurrentChannel, activateButton, currentChannel, messages, channels, connected, users, topic, newMessageOwner} = this.props;

        return (
            <div className="wrapper">
                <Topic topic={topic} />
                <Window messages={messages} />
                <UserPanel users={users}/>
                <InputPanel onSendMessage={processMessage}/>
                <ButtonPanel onButtonClick={activateButton} currentChannel={currentChannel} channels={channels} newMessageOwner={newMessageOwner} />
            </div>
        )
    }

    renderLoginWindow() {
        const {connectToIrc} = this.props;

        return (
            <LoginWindow connectToIrc={connectToIrc} />
        )
    }
}

IndexPage.defaultProps = {
    topic: 'No topic set'
}
