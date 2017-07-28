import Cookies from 'js-cookie';


const TokenStore = {
    get() {
        return Cookies.get('auth_token');
    },

    store(token) {
        Cookies.set('auth_token', token);
    }
};

export default TokenStore;
