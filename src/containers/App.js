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
import NewPoll from './NewPoll';
import PollModal from '../components/modal/PollModal';
import Dashboard from './Dashboard';
import TokenStore from '../utils/tokenStore';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: this.isAuthenticated(),
            modal: null,
            votedPoll: null
        };

        this.authenticateUser = this.authenticateUser.bind(this);
        this.deauthenticateUser = this.deauthenticateUser.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.showPollModal = this.showPollModal.bind(this);
        this.dismissPollModal = this.dismissPollModal.bind(this);
        this.handleClickModal = this.handleClickModal.bind(this);
        this.handleVote = this.handleVote.bind(this);
    }

    authenticateUser(token) {
        TokenStore.store(token);
        this.setState({ isAuthenticated: true });
    }

    deauthenticateUser() {
        TokenStore.destroy();
        this.setState({ isAuthenticated: false });
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

    handleVote(votedPoll) {
        this.setState({ modal: null, votedPoll });
    }

    render() {
        return (
            <Router>
                <div>
                    <Header isAuthenticated={this.state.isAuthenticated}
                            handleLogout={this.deauthenticateUser} />
                    <main className='main'>
                        <div className='main__inner'>
                            <Route exact path='/' render={() => (
                                <Home selectPoll={this.showPollModal} votedPoll={this.state.votedPoll} />
                            )} />
                            <Route path='/login' render={() => (
                                <LogIn isAuthenticated={this.state.isAuthenticated} afterLogin={this.authenticateUser} />
                            )} />
                            <Route path='/signup' component={SignUp} />
                            <Route path='/new' render={() => (
                                <NewPoll isAuthenticated={this.state.isAuthenticated} />
                            )} />
                            <Route path='/dashboard' render={() => (
                                <Dashboard isAuthenticated={this.state.isAuthenticated} />
                            )} />
                        </div>
                    </main>
                    <Footer />

                    {this.state.modal &&
                        (<PollModal poll={this.state.modal} onClick={this.handleClickModal} dismiss={this.dismissPollModal} onVote={this.handleVote}/>)}
                </div>
            </Router>
        );
    }
}


export default App;
