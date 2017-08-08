import React, { Component } from 'react';
import axios from 'axios';
import UserInput from '../common/UserInput';
import Button from '../common/Button';
import TokenStore from '../../utils/tokenStore';


class PollEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            newOptions: [],
            error: null
        };

        this.addOption = this.addOption.bind(this);
        this.deletePoll = this.deletePoll.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    addOption() {
        this.setState(prevState => ({
            newOptions: prevState.newOptions.concat('')
        }));
    }

    deletePoll() {
        const url = `/api/polls/${this.props.poll._id}`;

        axios.delete(url, { headers: { 'Authorization': `Bearer ${TokenStore.get()}` }})
             .then(response => {
                this.props.onDeletion(this.props.poll._id);
             })
             .catch(error => {
                 const message = error.response.data.error;

                 this.setState({
                     error: message
                 });
             });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const options = this.state.newOptions;
        const optionId = parseInt(name.substr(7));
        const idx = optionId - (this.props.poll.options.length + 1);
        options[idx] = value;

        this.setState({ newOptions: options });
    }

    handleSubmit(event) {
        event.preventDefault();

        const url = `/api/polls/${this.props.poll._id}/options`;

        axios.patch(url, {
            options: this.state.newOptions
        }, {
            headers: {
                'Authorization': `Bearer ${TokenStore.get()}`
            }})
             .then(response => {
                 this.setState({ newOptions: []});
                 this.props.onAddOption(response.data);
             })
             .catch(error => {
                 const message = error.response.data.error;

                 this.setState({
                     error: message
                 });
             });
    }

    resetForm() {
        this.setState({ newOptions: [] });
    }

    render() {
        const poll = this.props.poll;
        const len = poll.options.length;  // original options number

        const newOptions = this.state.newOptions.map((option, index) =>
            <UserInput key={'option_' + (len + index + 1)}
                       label={'Option ' + (len + index + 1)}
                       name={'option_' + (len + index + 1)}
                       value={option}
                       onChange={this.handleChange} />
        );

        return (
            <form method='PATCH'
                  action={`/api/polls/${poll._id}`}
                  onSubmit={this.handleSubmit}
                  className='form' >

                <div>
                    <span className='form__link' onClick={this.addOption}>Add options (+)</span>
                    {' | '}
                    <span className='form__link form__link--danger' onClick={this.deletePoll}>Delete (x)</span>
                </div>

                {newOptions}
                {this.state.newOptions.length > 0 &&
                 <div className='button-group'>
                     <Button type='submit' className='form__submit'>Save</Button>
                     <Button className='form__submit' onClick={this.resetForm}>Cancel</Button>
                 </div>}
            </form>
        );
    }
}


export default PollEditForm;
