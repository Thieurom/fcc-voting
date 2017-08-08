import Cookies from 'js-cookie';


const TokenStore = {
    get() {
        return Cookies.get('auth_token');
    },

    store(token) {
        Cookies.set('auth_token', token);
    },

    destroy() {
        Cookies.remove('auth_token');
    }
};

export default TokenStore;
