import React from 'react';
import {Button} from 'react-bootstrap';
import ButtonPanel from './ButtonPanel';
import UserPanel from './UserPanel';
import Window from './Window';
import LoginWindow from './LoginWindow';
import InputPanel from './InputPanel';
import Topic from './Topic';

export default class LoginPage extends React.Component {

    render() {
        const {connectToIrc} = this.props;
        
        return (    
            <div className="component">	
                
                <LoginWindow connectToIrc={connectToIrc} />
            </div>
        );
    }
}
