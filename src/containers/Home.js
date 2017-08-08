import React, { Component } from 'react';
import axios from 'axios';
import PollQuestion from '../components/poll/PollQuestion';
import PollChart from '../components/poll/PollChart';
import Loading from '../components/common/Loading';


function PollList({ polls, selectPoll }) {
    return (
        <div className='polls'>
            {polls.map(poll => {
                const options = poll.options.map(option => option.content);
                const votes = poll.options.map(option => option.votes);

                return (
                    <article key={'poll.' + poll._id} className='card poll' onClick={() => { selectPoll(poll); }}>
                        <PollQuestion question={poll.question} />
                        {votes.some(vote => vote > 0)
                            ? <PollChart labels={options} data={votes} />
                            : <div className='poll-info'>Be the first to vote.</div>
                        }
                    </article>
                );
            })}
        </div>
    );
};


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            polls: null
        };

        this.fetchPolls = this.fetchPolls.bind(this);
        this.selectPoll = this.selectPoll.bind(this);
    }

    fetchPolls() {
        const url = '/api/polls';

        axios.get(url)
            .then(response => {
                const polls = response.data;
                this.setState({polls});
            })
    }

    selectPoll(poll) {
        this.props.selectPoll(poll);
    }

    componentDidMount() {
        this.fetchPolls();
    }

    componentWillReceiveProps(nextProps) {
        const votedPoll = nextProps.votedPoll;

        if (votedPoll && (this.props.votedPoll !== votedPoll)) {
            let polls = this.state.polls;

            const updatedPolls = polls.map(poll => {
                if (poll._id === votedPoll._id) {
                    return votedPoll;
                }

                return poll;
            });

            this.setState({ polls: updatedPolls });
        }
    }

    render() {
        if (!this.state.polls) {
            return <Loading />;
        }

        return (
            <PollList polls={this.state.polls} selectPoll={this.selectPoll} />
        );
    }
}


export default Home;
