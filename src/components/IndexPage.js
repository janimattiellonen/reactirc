import React from 'react';
import {Button} from 'react-bootstrap';
import ButtonPanel from './ButtonPanel';
import UserPanel from './UserPanel';
import Window from './Window';
import InputPanel from './InputPanel';
import Topic from './Topic';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {connectToIrc, processMessage, setCurrentChannel, currentChannel, messages, channels, connected, users, topic} = this.props;

        return (    
            <div className="component">
                <div>
                    <Button disabled={connected == true} onClick={connectToIrc}>Connect</Button>
                </div>
                
                <UserPanel users={users}/>
                <Topic topic={topic} />
                <Window messages={messages} />
                <InputPanel onSendMessage={processMessage}/>

                <ButtonPanel onButtonClick={setCurrentChannel} currentChannel={currentChannel} channels={channels}/>
            </div>
        );
    }
}

IndexPage.defaultProps = {
    topic: 'No topic set'
}
