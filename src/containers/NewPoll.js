import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PollForm from '../components/poll/PollForm';


class NewPoll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            completed: false
        }

        this.handleCompletion = this.handleCompletion.bind(this);
    }

    handleCompletion(response) {
        this.setState({ completed: true });
    }

    render() {
        if (this.state.completed) {
            return <Redirect to='/' />;
        }

        return (
            <div className='panel'>
                <div className='panel__heading'>
                    <h2 className='h2'>Create new poll</h2>
                </div>
                <div className='panel__body'>
                    <PollForm action='/api/polls' submit='Create' onCompletion={this.handleCompletion} />
                </div>
            </div>
        );
    }
}

export default NewPoll;
