import React, { Component } from 'react';
import PropTypes from 'prop-types';


function UserInput(props) {
    const { label, name, type, onChange, value } = props;
    
    return (
        <div>
            {label && <label htmlFor={name} className='form__label'>{label}</label>}
            <input type={type}
                   id={name}
                   name={name}
                   className='form__input'
                   value={value}
                   onChange={onChange} />
       </div>
    );
}

UserInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string
};

UserInput.defaultProps = {
    type: 'text'
};

export default UserInput;
