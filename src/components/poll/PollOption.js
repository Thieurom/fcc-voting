import React, { Component } from 'react';
import PropTypes from 'prop-types';


function PollOption({ disabled, option, onClick }) {
    let labelClass = 'form__label form__label--with-radio';
    if (disabled) labelClass += ' form__label--disabled';

    return (
        <label className={labelClass}>
            <input
                className='form__radio'
                type='radio'
                disabled={disabled}
                name='option'
                data-option-id={option._id}
                value={option.content}
                onClick={() => { onClick(option._id) }} />
            {option.content}
        </label>
    );
}

PollOption.propTypes = {
    disabled: PropTypes.bool,
    option: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    }),
    onClick: PropTypes.func
};

export default PollOption;
