import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';


class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Header />

                    <main className='main'>
                        <div className='main__inner'>
                            <Route exact path='/' component={Home} />
                            <Route path='/login' component={Login} />
                            <Route path='/signup' component={Signup} />
                        </div>
                    </main>
                </div>
            </Router>
        );
    }
}


export default App;
