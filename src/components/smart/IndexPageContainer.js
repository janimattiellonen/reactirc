import { connect } from 'react-redux';
import IndexPage from '../IndexPage';
import {connectToIrc, initIoConnection, processMessage} from '../../actions/irc-actions';

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
        processMessage: (message) => dispatch(processMessage(message))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexPage);
