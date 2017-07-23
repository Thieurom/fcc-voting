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


class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <main className='main'>
                        <div className='main__inner'>
                            <Route exact path='/' component={Home} />
                            <Route path='/login' component={LogIn} />
                            <Route path='/signup' component={SignUp} />
                        </div>
                    </main>
                    <Footer />
                </div>
            </Router>
        );
    }
}


export default App;
