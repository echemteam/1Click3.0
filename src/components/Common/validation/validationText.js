//** Component  */
import React from 'react';

const ValidationText = (props) => {
    return (
        <React.Fragment>
            <span className="error-message float-left">{props.errorText}</span>
        </React.Fragment>
    );
};

export default ValidationText;
