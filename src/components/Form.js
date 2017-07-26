import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserInput from './UserInput';


class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            credentials: {
                username: '',
                password: '',
            },
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let credentials = this.state.credentials;

        credentials[event.target.name] = event.target.value;
        this.setState({ credentials });
    }

    handleSubmit(event) {
        event.preventDefault();

        const url = this.props.action;

        axios.post(url, this.state.credentials)
            .then(response => {
                this.props.onCompletion(response.data);
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
            <form method='POST' action={this.props.action} className='form'
                  onSubmit={this.handleSubmit} >

                  <UserInput label='Username'
                      name='username'
                      value={this.state.credentials.username}
                      onChange={this.handleChange} />
                  
                  <UserInput label='Password'
                      type='password'
                      name='password'
                      value={this.state.credentials.password}
                      onChange={this.handleChange} />
                   
                {this.state.error &&
                    <div className='form__error'>{this.state.error}</div>
                }

                <input type='submit' value={this.props.submit} className='form__submit' />
            </form>
        );
    }
}

Form.defaultProps = {
    submit: 'Submit'
};

Form.propTypes = {
    action: PropTypes.string.isRequired,
    submit: PropTypes.string,
    onCompletion: PropTypes.func.isRequired
};


export default Form;
