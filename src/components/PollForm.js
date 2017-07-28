import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserInput from './UserInput';
import TokenStore from '../utils/tokenStore';


class PollForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            poll: {
                question: '',
                options: [
                    { content: '' },
                    { content: '' }
                ]
            },
            error: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.addOption = this.addOption.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        const poll = this.state.poll;

        if (field === 'question') {
            poll.question = value;

        } else {
            const optionId = parseInt(field.substr(7));
            poll.options[optionId - 1].content = value;
        }

        this.setState({ poll });
    }

    addOption() {
        const poll = this.state.poll;

        poll.options.push({ content: '' });
        this.setState({ poll });
    }

    handleSubmit(event) {
        event.preventDefault();

        const url = this.props.action;

        axios.post(url, this.state.poll, { headers: { 'Authorization': `Bearer ${TokenStore.get()}` }})
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
        const options = this.state.poll.options.map((option, index) => 
            <UserInput key={'option_' + (index + 1)}
                label={'Option ' + (index + 1)}
                name={'option_' + (index + 1)}
                value={option.content}
                onChange={this.handleChange}
            />
        );

        return (
            <form method='POST' action={this.props.action} className='form'
                  onSubmit={this.handleSubmit} >

                  <UserInput label='Question'
                      name='question'
                      value={this.state.question}
                      onChange={this.handleChange} />

                  <div className='form__options'>
                      {options}
                  </div>

                  <div>
                      <span className='form__link' onClick={this.addOption}>More options (+)</span>
                  </div>

                <input type='submit' value={this.props.submit} className='form__submit' />
            </form>
        );
    }
}

PollForm.defaultProps = {
    submit: 'Submit'
};

PollForm.propTypes = {
    action: PropTypes.string.isRequired,
    submit: PropTypes.string,
    onCompletion: PropTypes.func.isRequired
};


export default PollForm;
