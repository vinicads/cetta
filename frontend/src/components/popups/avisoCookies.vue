<template>
    <div class="loading-screen" v-if="!cookieAccepted">
      <div class="loading-content">
        <p class="Titulo">Cookies</p>
        <p class="Conteudo">Nós utilizamos cookies para garantir o funcionamento do site. Ao continuar navegando, você aceita nossa <a href="https://www.cnmp.mp.br/portal/transparencia/lei-geral-de-protecao-de-dados-pessoais-lgpd/cidadao/politica-de-cookies" target="_blank">Política de cookies.</a></p>
        <p style="text-align: center; margin-top: 5%;"><button value="" @click="aceitarCookies">Ok</button></p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import store from '@/auth/autenticacao.js'
  import VueCookies from 'vue-cookies';
  export default {
  name: 'HomeTemp',
  data() {
    return {
      cookieAccepted: true,
    };
  },
watch: {
    '$store.state.isVerified'(newItem, oldItem) {
      this.cookieAccepted = store.state.cookieAccepted;
    },
  },
  mounted() {
    this.cookieAccepted = store.state.cookieAccepted;
  },
  methods: {
    async aceitarCookies(){
      this.cookieAccepted = true;
      axios.get(`${store.state.apiUrl}/login/cookieAccepted`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async (response) => {
          return;
        })
        .catch((error) => { 
          console.log(error)
        })
       
    }
  }
}
</script>

  <style scoped>
  .loading-screen {
    position: fixed;
    bottom: 20px;
    right: 20px; 
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    max-width: 20%;
    background-color: black;
    padding: 1.5%;
    z-index: 999999999999999999999999999;
  }
  
  .Titulo {
    font-size: 25px;
    text-align: left;
  }
  
  .Conteudo {
    text-align: left;
    font-size: 13px;
  }
  
  .loading-content {
    display: block;
    text-align: center;
    color: white;
  }
  
  p {
    margin: 0;
  }

  button{
    border-radius: 5px;
    width: 35%;
    border: none;
  }
  
  button:hover{
    color: white;
    background-color: #162D50;
    transition: 0.5s;
  }
  @media screen and (max-width: 700px) {
    .Titulo {
      font-size: 20px;
    }
  
    .Conteudo {
      font-size: 13px;
      text-align: justify;
    }
  
    .loading-screen {
      max-width: 100vw;
      width: 100%;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
    }
  }
  </style>
  
