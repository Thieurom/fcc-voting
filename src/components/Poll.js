import React, { Component } from 'react';
import PollChart from './PollChart';
import Button from './/Button';


function Poll(props) {
    const poll = props.poll;
    const options = poll.options.map(option => option.content);
    const votes = poll.options.map(option => option.votes.length);

    return (
        <div className='poll' onClick={() => {props.onClick(poll);}}>
            <div className='poll__question'>
                <h2 className='h2'>{poll.question}</h2>
            </div>
            {votes.some(vote => vote > 0)
                ? (<div className='poll__chart'>
                <PollChart labels={options} data={votes} />
                </div>)
                : (<div className='poll__info'>Be the first to vote!</div>)
            }
        </div>
    );
}


export default Poll;
