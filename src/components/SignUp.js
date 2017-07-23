import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Form from './Form';


class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            completed: false
        };

        this.handleCompletion = this.handleCompletion.bind(this);
    }

    handleCompletion() {
        this.setState({
            completed: true
        });
    }

    render() {
        if (this.state.completed) {
            return <Redirect to='/login' />;
        }

        return (
            <div className='panel'>
                <div className='panel__heading'>
                    <h2 className='h2'>Create new account</h2>
                </div>
                <div className='panel__body'>
                    <Form onCompletion={this.handleCompletion} />
                </div>
            </div>
        );
    }
}


export default SignUp;
