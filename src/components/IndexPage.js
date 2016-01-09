import React from 'react';
import {Button} from 'react-bootstrap';
import ButtonPanel from './ButtonPanel';
import UserPanel from './UserPanel';
import Window from './Window';
import InputPanel from './InputPanel';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {connectToIrc, sendMessage, messages, channels} = this.props;

        return (    
            <div className="component">
                <Button onClick={connectToIrc}>Connect</Button>
                <Window messages={messages} />
                <InputPanel onSendMessage={sendMessage}/>
                <UserPanel />

                <ButtonPanel channels={channels}/>
            </div>
        );
    }
}

/*
    Kun liitytään kanavalle /JOIN #xxx -komennolla:

    1) lähetetään komento palvelimelle
    2) odotetaan, että saadaan palvelimelta ok-viesti (huoneeseen on pääsy)
    3) lisätään ButtonPaneliin uusi nappi, jonka labelinä kanavan nimi
    4) lisätään UserPaneliin kanavalla olevien käyttäjien nimet
    5) näytetään kanavaan liittyvät viestit Window-komponentissa

*/
/*
    state = {
        channels: {
            '#foo': {
                topic: 'Lussutin lus',
                modes: 'aeiou',
                users: {
                    {
                        nick: 'jme',
                        me: true
                    },
                    {
                        nick: 'jme_'
                    }
                }
            }
        }
    }
*/