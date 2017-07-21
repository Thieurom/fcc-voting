import React from 'react';
import { Link } from 'react-router-dom';


function Header(props) {
    return (
        <header className='header'>
            <div className='header__inner'>
                <Link to='/' className='brand-logo'>Votee!</Link>
                <nav className='nav'>
                    <Link to='/login' className='nav__link'>Log in</Link>
                    <Link to='/signup' className='nav__link'>Sign up</Link>
                </nav>
            </div>
        </header>
    );
}


export default Header;
