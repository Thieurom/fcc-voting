import React, { Component } from 'react';
import PropTypes from 'prop-types';


function PollOption({ option }) {
    return (
        <label className='form__label form__label--with-radio'>
            <input className='form__radio' type='radio' name='option' value={option} />
            {option}
        </label>
    );
}

PollOption.propTypes = {
    option: PropTypes.string.isRequired
};

export default PollOption;
