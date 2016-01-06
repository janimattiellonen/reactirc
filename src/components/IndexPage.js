import React from 'react';

import ButtonPanel from './ButtonPanel';
import UserPanel from './UserPanel';
import Window from './Window';
import InputPanel from './InputPanel';

const IndexPage = props => {

    return (
        <div className="component">
            
        	<Window />
        	<InputPanel />
            <UserPanel />

            <ButtonPanel />
        </div>
    );
};

export default IndexPage;
