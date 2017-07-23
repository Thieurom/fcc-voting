import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';


export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, input) {
        const value = e.target.value;
        let newState = {};

        if (input === 'username') {
            newState.username = value;
        } else if (input === 'password') {
            newState.password = value;
        }

        this.setState(newState);
    }

    handleSubmit(e) {
        e.preventDefault();

        const { username, password } = this.state;

        axios.post('/api/users', { username, password })
            .then(response => {
                this.props.onCompletion();
            })
            .catch(error => {
                const message = error.response.data.error;

                this.setState({
                    error: message
                });
            });
    }

    render() {
        return (
            <form method='POST' action='api/users' className='form'
                  onSubmit={this.handleSubmit} >

                <label htmlFor='username' className='form__label'>Username</label>
                <input type='text' name='username' autoFocus='true'
                       id='username'
                       className='form__input'
                       value={this.state.username}
                       onChange={(e) => {
                           this.handleChange(e, 'username');
                       }} />

                <label htmlFor='password' className='form__label'>Password</label>
                <input type='password' name='password' className='form__input'
                       id='password'
                       value={this.state.password}
                       onChange={(e) => {
                           this.handleChange(e, 'password');
                       }} />
                   
                {this.state.error &&
                    <div className='form__error'>{this.state.error}</div>
                }

                <input type='submit' value='Submit' className='form__submit' />
            </form>
        );
    }
}
