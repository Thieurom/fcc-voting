import React, { Component } from 'react';
import PropTypes from 'prop-types';


function PollQuestion({ question }) {
    return (
        <div className='poll-question'>
            <h2 className='h2'>{question}</h2>
        </div>
    );
};


PollQuestion.propTypes = {
    question: PropTypes.string.isRequired
};


export default PollQuestion;
