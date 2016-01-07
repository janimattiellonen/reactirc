import { connect } from 'react-redux';
import IndexPage from '../IndexPage';
import {connectToIrc, initIoConnection, sendMessage} from '../../actions/irc-actions';

function mapStateToProps(state) {
    return {
       messages: state.irc.messages
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
