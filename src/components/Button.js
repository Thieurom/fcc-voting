import React, { Component } from 'react';
import PropTypes from 'prop-types';


function Button(props) {
    const { disabled, type } = props;

    return (
        <button
            className={disabled ? 'button button--disabled' : 'button'}
            disabled={disabled}
            type={type}>
            {props.children}
        </button>
    );
}

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string
};

Button.defaultProps = {
    disabled: false,
    type: 'button'
}


export default Button;
