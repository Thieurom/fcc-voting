import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import PollCreation from './PollCreation';
import PollQuestion from './PollQuestion';
import PollChart from './PollChart';
import PollOption from './PollOption';
import Button from './Button';
import TokenStore from '../utils/tokenStore';


function PollModal({ poll, onClick, dismiss }) {
    const options = poll.options.map(option => option.content);
    const votes = poll.options.map(option => option.votes.length);

    return (
        <div className='modal' onClick={onClick} >
            <button className='modal__dismiss' onClick={dismiss}><i className='fa fa-times'></i></button>
            <div className='modal__inner'>
                <PollQuestion question={poll.question} />

                {votes.some(vote => vote > 0)
                    ? <PollChart labels={options} data={votes} />
                    : <div className='poll-info'>Be the first to vote.</div>
                }

                <form className='form'>
                    <div className='form__options'>
                        {options.map((option, index) => (
                            <PollOption key={'modal.poll.option.' + (index + 1)}option={option} />))}
                    </div>
                    <Button type='submit'>Vote</Button>
                </form>
            </div>
        </div>
    );
}


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: this.isAuthenticated(),
            modal: null
        };

        this.authenticateUser = this.authenticateUser.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.showPollModal = this.showPollModal.bind(this);
        this.dismissPollModal = this.dismissPollModal.bind(this);
        this.handleClickModal = this.handleClickModal.bind(this);
    }

    authenticateUser(token) {
        TokenStore.store(token);
        this.setState({ isAuthenticated: true });
    }

    isAuthenticated() {
        if (TokenStore.get()) {
            return true;
        }
        return false;
    }

    handleClickModal(event) {
        event.stopPropagation();

        const target = event.target;
        if (target.classList.contains('modal')) {
            this.dismissPollModal();
        }
    }

    showPollModal(poll) {
        this.setState({ modal: poll });
    }

    dismissPollModal() {
        this.setState({ modal: null });
    }

    render() {
        return (
            <Router>
                <div>
                    <Header isAuthenticated={this.state.isAuthenticated} />
                    <main className='main'>
                        <div className='main__inner'>
                            <Route exact path='/' render={() => (
                                <Home selectPoll={this.showPollModal} />
                            )} />
                            <Route path='/login' render={() => (
                                <LogIn isAuthenticated={this.state.isAuthenticated} afterLogin={this.authenticateUser} />
                            )} />
                            <Route path='/signup' component={SignUp} />
                            <Route path='/new' render={() => (
                                <PollCreation isAuthenticated={this.state.isAuthenticated} />
                            )} />
                        </div>
                    </main>
                    <Footer />

                    {this.state.modal &&
                        (<PollModal poll={this.state.modal} onClick={this.handleClickModal} dismiss={this.dismissPollModal} />)}
                </div>
            </Router>
        );
    }
}


export default App;
