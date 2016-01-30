import { connect } from 'react-redux';
import IndexPage from '../IndexPage';
import {connectToIrc, initIoConnection, processMessage, setCurrentChannel, activateButton} from '../../actions/irc-actions';

function mapStateToProps(state) {
    return {
        messages: state.irc.messages,
        channels: state.irc.channels,
        currentChannel: state.irc.activeChannel,
        connected: state.irc.connected,
        users: state.irc.users,
        topic: state.irc.topic
    }
}

function mapDispatchToProps(dispatch) {
    return {
    	connectToIrc: (nick, host, port) => dispatch(connectToIrc(nick, host, port)),
        processMessage: (message) => dispatch(processMessage(message)),
        setCurrentChannel: (channelName) => dispatch(setCurrentChannel(channelName)),
        activateButton: (buttonId) => dispatch(activateButton(buttonId))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexPage);
