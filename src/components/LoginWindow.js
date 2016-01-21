import React from 'react';
import {Button} from 'react-bootstrap';

export default class Login extends React.Component {


    render() {
        const {connectToIrc} = this.props;

        return (
            <div className="login-window">
        		<h2>Login</h2>

                <div className="form-group">
                    <label htmlFor="username" className="col-sm-2">Username</label>
                    <div className={'col-sm-8'}>
                        <input type="text" id="username" />                      
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="server" className="col-sm-2">Server</label>
                    <div className={'col-sm-8'}>
                        <input type="text" id="server" />                      
                    </div>
                </div>

                <div>
                    <Button onClick={connectToIrc}>Connect</Button>
                </div>         
            </div>
        );
    }

 
}
