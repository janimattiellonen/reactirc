import React from 'react';
import {Button} from 'react-bootstrap';

export default class LoginWindow extends React.Component {

    constructor(props) {
        super(props);

        const {nick, host, port} = props;

        this.state = {
            nick: nick,
            host: host,
            port: port
        }
    }

    handleChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const {connectToIrc} = this.props;

        return (
            <div className="login-window">
        		<h2>Login</h2>

                <div className="form-group">
                    <label htmlFor="nick" className="col-sm-2">Nick</label>
                    <div className={'col-sm-8'}>
                        <input type="text" id="nick" name="nick" value={this.state.nick} onChange={::this.handleChange} />                      
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="server" className="col-sm-2">Server</label>
                    <div className={'col-sm-8'}>
                        <input type="text" id="server" name="host" value={this.state.host} onChange={::this.handleChange} />                      
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="port" className="col-sm-2">Port</label>
                    <div className={'col-sm-8'}>
                        <input type="text" id="port" name="port" value={this.state.port} onChange={::this.handleChange} />                      
                    </div>
                </div>

                <div>
                    <Button onClick={::this.onLogin}>Connect</Button>
                </div>         
            </div>
        );
    }

    onLogin() {
        console.log("state: " + JSON.stringify(this.state));
        this.props.connectToIrc(this.state.nick, this.state.host, this.state.port);
    }
}

LoginWindow.defaultProps = {
    nick: 'jme2',
    host: 'localhost',
    port: 6667
}
