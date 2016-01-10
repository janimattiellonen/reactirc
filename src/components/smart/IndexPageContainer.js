import { connect } from 'react-redux';
import IndexPage from '../IndexPage';
import {connectToIrc, initIoConnection, sendMessage} from '../../actions/irc-actions';

function mapStateToProps(state) {
    return {
       messages: state.irc.messages,
       channels: state.irc.channels,
       connected: state.irc.connected,
       users: state.irc.users
    }
}

function mapDispatchToProps(dispatch) {
    return {
    	connectToIrc: () => dispatch(connectToIrc()),
        sendMessage: (message) => dispatch(sendMessage(message))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexPage);
