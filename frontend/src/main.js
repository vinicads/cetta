import './assets/main.css'
import store from './auth/autenticacao.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies';
import VueScrollTo from 'vue-scrollto';


const app = createApp(App)

app.use(VueCookies)
app.use(VueScrollTo);

async function initializeApp() {
  try {
    store.dispatch('checkAuthentication', VueCookies.$cookies); 
    app.use(store).use(router).mount('#app');
  } catch (error) {
    console.error('Erro ao verificar a autenticação:', error);
  }
}

initializeApp();
