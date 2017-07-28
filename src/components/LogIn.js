import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
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

LogIn.propTypes = {
    isAuthenticated: PropTypes.bool,
    afterLogin: PropTypes.func.isRequired
};

LogIn.defaultProps = {
    isAuthenticated: false
};


export default LogIn;
