import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


function Header({ isAuthenticated }) {
    return (
        <header className='header'>
            <div className='header__inner'>
                <Link to='/' className='brand-logo'>Votee!</Link>
                {isAuthenticated ? (
                    <nav className='nav'>
                        <div className='nav__dropdown'>
                            <i className='fa fa-user-circle' style={{fontSize: '20px'}}></i>
                            <ul className='dropdown'>
                                <li className='dropdown__item'>
                                    <Link to='/profile' className='nav__link'>Profile</Link>
                                </li>
                                <li className='dropdown__item'>
                                    <Link to='/logout' className='nav__link'>Log out</Link>
                                </li>
                            </ul>
                        </div>
                        <Link to='/new' className='nav__link'><i className='fa fa-edit' style={{fontSize: '20px'}}></i></Link>
                    </nav>
                ) : (
                    <nav className='nav'>
                        <Link to='/login' className='nav__link'>Log in</Link>
                        <Link to='/signup' className='nav__link'>Sign up</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};


export default Header;
