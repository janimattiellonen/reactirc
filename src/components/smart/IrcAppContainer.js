import { connect } from 'react-redux';
import IrcApp from '../IrcApp';
import {initIoConnection, sendMessage} from '../../actions/irc-actions';

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
    	initIoConnection: () => dispatch(initIoConnection()),
    	sendMessage: (message) => dispatch(sendMessage(message))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IrcApp);
