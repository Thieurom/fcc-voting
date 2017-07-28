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
import TokenStore from '../utils/tokenStore';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: this.isAuthenticated()
        };

        this.authenticateUser = this.authenticateUser.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
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

    render() {
        return (
            <Router>
                <div>
                    <Header isAuthenticated={this.state.isAuthenticated} />
                    <main className='main'>
                        <div className='main__inner'>
                            <Route exact path='/' component={Home} />
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
                </div>
            </Router>
        );
    }
}


export default App;
