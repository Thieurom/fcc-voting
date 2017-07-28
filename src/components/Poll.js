import React, { Component } from 'react';


export default function Poll({poll}) {
    return (
        <div className='poll'>
            <div className='poll__title'>
                <h2 className='h2'>{poll.question}</h2>
            </div>
            <div className='poll__info'>
            </div>
        </div>
    );
}
