// auth/verificaLogin.js
import store from './autenticacao';
import VueCookies from 'vue-cookies';
const verificaLogin = async (to, from, next) => {
  if (!store.state.isVerified){
    await store.dispatch('checkAuthentication', VueCookies.$cookies);
  }
    if (store.state.isAuthenticated) {
        next({ name: 'home' });
      } else {
        next();
      }
};

export default verificaLogin;
