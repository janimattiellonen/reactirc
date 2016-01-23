import { connect } from 'react-redux';
import LoginPage from '../LoginPage';
import {connectToIrc, initIoConnection, processMessage, setCurrentChannel} from '../../actions/irc-actions';

function mapStateToProps(state) {
    return {
        connected: state.irc.connected,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        connectToIrc: (nick, host, port) => dispatch(connectToIrc(nick, host, port)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);
