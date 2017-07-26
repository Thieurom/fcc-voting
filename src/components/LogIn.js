import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import Form from './Form';


class LogIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            completed: this.props.isAuthenticated
        };

        this.handleCompletion = this.handleCompletion.bind(this);
    }

    handleCompletion(response) {
        this.props.afterLogin(response.token);
        this.setState({
            completed: true
        });
    }

    render() {
        if (this.state.completed) {
            return <Redirect to='/' />;
        }

        return (
            <div className='panel'>
                <div className='panel__heading'>
                    <h2 className='h2'>Login</h2>
                </div>
                <div className='panel__body'>
                    <Form action='/login' submit='Log in' onCompletion={this.handleCompletion} />
                </div>
            </div>
        );
    }
}


export default LogIn;
