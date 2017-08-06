import React, { Component } from 'react';
import PropTypes from 'prop-types';


function PollOption({ option, onClick }) {
    return (
        <label className='form__label form__label--with-radio'>
            <input
                className='form__radio'
                type='radio'
                name='option'
                data-option-id={option._id}
                value={option.content}
                onClick={() => { onClick(option._id) }} />
            {option.content}
        </label>
    );
}

PollOption.propTypes = {
    option: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    })
};

export default PollOption;
