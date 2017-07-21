import React, { Component } from 'react';
import axios from 'axios';
import Poll from './Poll';


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            polls: []
        };

        this.populate = this.populate.bind(this);
    }

    populate(polls) {
        const url = '/api/polls';

        axios.get(url)
            .then(response => {
                return response.data;
            })
            .then(polls => {
                this.setState({polls});
            });
    }

    componentDidMount() {
        this.populate(this.state.polls);
    }

    render() {
        const polls = this.state.polls;
        const listPolls = polls.map(poll =>
            <Poll key={poll.id} poll={poll} />
        ); 

        return (
            <div>
                {listPolls}
            </div>
        );
    }
}


export default Home;
