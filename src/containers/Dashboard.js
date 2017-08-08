import React, { Component } from 'react';
import axios from 'axios';
import PollQuestion from '../components/poll/PollQuestion';
import PollOption from '../components/poll/PollOption';
import PollEditForm from '../components/poll/PollEditForm';
import Loading from '../components/common/Loading';
import TokenStore from '../utils/tokenStore';




class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            polls: null
        };

        this.fetchUserPolls = this.fetchUserPolls.bind(this);
        this.replaceUserPoll = this.replaceUserPoll.bind(this);
    }

    fetchUserPolls() {
        const url = '/api/polls/current_user';

        axios.get(url, { headers: { 'Authorization': `Bearer ${TokenStore.get()}` }})
            .then(response => {
                const polls = response.data;
                this.setState({polls});
            });
    }

    replaceUserPoll(updatedPoll) {
        let polls = this.state.polls;

        for (let i = 0, len = polls.length; i < len; i++) {
            if (polls[i]._id === updatedPoll._id) {
                polls[i] = updatedPoll;
                break;
            }
        }

        this.setState({ polls });
    }

    componentDidMount() {
        this.fetchUserPolls();
    }

    render() {
        if (!this.state.polls) {
            return <Loading />;
        }

        const pollList = this.state.polls.map(poll =>
            <article key={'poll.' + poll._id} className='card poll poll--edit'>
                <PollQuestion question={poll.question} />
                <div className='form__options'>
                    {poll.options.map((option, index) => (
                        <PollOption
                            disabled={true}
                            key={'poll.option.' + (index + 1)}
                            option={option} />))}
                </div>
                <PollEditForm poll={poll} onAddOption={this.replaceUserPoll}/>
            </article>);

        return (
            <div className='polls'>
                {pollList}
            </div>
        );
    }
}


export default Dashboard;
