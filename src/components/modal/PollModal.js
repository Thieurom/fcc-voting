import React, { Component } from 'react';
import axios from 'axios';
import PollQuestion from '../poll/PollQuestion';
import PollChart from '../poll/PollChart';
import PollOption from '../poll/PollOption';
import Button from '../common/Button';
import TokenStore from '../../utils/tokenStore';


class PollModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: null,
            error: null
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSelect(option) {
        this.setState({ selectedOption: option });
    }

    handleSubmit(event) {
        event.preventDefault();

        const url = `/api/polls/${this.props.poll._id}/votes`;
        axios.patch(url, {
            option: this.state.selectedOption
        }, {
            headers: {
                'Authorization': `Bearer ${TokenStore.get()}`
            }})
             .then(response => {
                this.props.onVote(response.data);
            })
            .catch(error => {
                const message = error.response.data.error;

                this.setState({
                    error: message
                });
            });
    }

    render() {
        const poll = this.props.poll;
        const options = poll.options.map(option => option.content);
        const votes = poll.options.map(option => option.votes);

        return (
            <div className='modal' onClick={this.props.onClick} >
                <button
                    className='modal__dismiss'
                    onClick={this.props.dismiss}><i className='fa fa-times'></i>
                </button>
                <div className='modal__inner'>
                    <PollQuestion question={poll.question} />

                    {votes.some(vote => vote > 0)
                     ? <PollChart labels={options} data={votes} />
                     : <div className='poll-info'>Be the first to vote.</div>}

                <form
                    method='PATCH'
                    action={`/api/polls/${poll._id}`}
                    onSubmit={this.handleSubmit}
                    className='form' >
                        <div className='form__options'>
                            {poll.options.map((option, index) => (
                                <PollOption
                                    key={'modal.poll.option.' + (index + 1)}
                                    option={option}
                                    onClick={this.handleSelect} />))}
                        </div>
                        {this.state.error &&
                            <div className='form__error'>{this.state.error}</div>
                        }
                        {this.state.selectedOption
                         ? <Button type='submit'>Vote</Button>
                         : <Button type='submit' disabled={true}>Vote</Button>}
                    </form>
                </div>
            </div>
        );
    }
}


export default PollModal;
