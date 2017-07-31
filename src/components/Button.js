import React, { Component } from 'react';
import PropTypes from 'prop-types';


function Button(props) {
    let className = 'button';

    if (props.className) {
        className = className + ' ' + props.className;
    }

    return (
        <button type={props.type} className={className}>{props.children}</button>
    );
}

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string
};

Button.defaultProps = {
    type: 'button'
}


export default Button;
