// auth/verificaLogin.js
import store from './autenticacao';
import VueCookies from 'vue-cookies';

const authGuard = async (to, from, next) => {
  if (!store.state.isVerified){
    await store.dispatch('checkAuthentication', VueCookies.$cookies);
  }
  if (store.state.isAuthenticated) {
    next();
  } else {
    next({ name: 'login' }); 
  }
};


export default authGuard;
