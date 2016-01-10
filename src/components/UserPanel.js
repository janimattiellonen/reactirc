import React from 'react';


export default class UserPanel extends React.Component {

    render() {

        const {users} = this.props;
        
        return (
            <div className="user-panel">
                <div className="">

                    <ul>
                        {users.map(user => {
                            return (
                                <li>{this.renderUser(user)}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    renderUser(user) {
        if (null == user) {
            return null;
        }

        return (user.op ? '@' : '') + user.nick;
    }
}
