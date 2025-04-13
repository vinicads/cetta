<template>
  <popupCarregamentoTemp v-if="loading" />
  <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
    @fechar-modal="fecharModal" />
  <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
    @fechar-modal="fecharModal" />
  <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
    @fechar-modal="fecharModal" />
  <forgotPassowordTemp @fecharForgotPassoword="closeForgotPasswordTemp" :emailUsado="email"
    :showForgotPassowrd="forgotPassoword" />
  <div class="main-login">
    <router-link to="/"><button class="voltar"><img src="../../assets/icons/back.png"
          alt="">Voltar</button></router-link>
    <div class="left-login">
      <img src="../../assets/icons/logo-miniatura.png" alt="">
    </div>
    <div class="right-login">
      <div class="card-login">
        <h1>LOGIN</h1>
        <div class="textfield">
          <label for="usuario">E-mail</label>
          <input type="text" v-model="email" name="email" @keyup.enter="verificaCredenciais" placeholder="E-mail">
        </div>
        <div class="textfield">
          <label for="password">Senha</label>
          <div class="password-container">
            <input :type="showPassword ? 'text' : 'password'" @keyup.enter="verificaCredenciais" v-model="senha" name="password" placeholder="Senha">
            <button type="button" class="toggle-password" @click="togglePasswordVisibility">
              <img src="../../assets/icons/cadeadoFechado.png" v-if="!showPassword" alt="">
              <img src="../../assets/icons/cadeadoAberto.png" v-else alt="">
            </button>
          </div>
        </div>
        <div class="textfield">
          <label for="" class="forgot" @click="showForgotPassoword()">Esqueci minha senha</label>
        </div>
        <button class="btn-login" @click="verificaCredenciais()">Login</button>
        <div class="fieldText">
          Ainda não possui cadastro? <router-link to="/cadastro">Clique aqui.</router-link>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import Mensagem from '../alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '../popups/popupCarregamentoLoginTemp.vue'
import forgotPassowordTemp from './forgotPassowordTemp.vue'
import { ref } from 'vue';

export default {
  components: {
    Mensagem,
    popupCarregamentoTemp,
    forgotPassowordTemp
  },
  data() {
    return {
      email: '',
      senha: '',
      mensagemErro: '',
      mensagemSucesso: '',
      mensagemAlerta: '',
      showPassword: false,
      forgotPassoword: false,
      loading: false
    }
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.logar);
  },
  mounted() {
    document.addEventListener('keydown', this.logar);
  },
  methods: {
    showForgotPassoword() {
      document.removeEventListener('keydown', this.logar);
      this.forgotPassoword = true;
    },
    closeForgotPasswordTemp() {
      document.addEventListener('keydown', this.logar);
      this.forgotPassoword = false;
    },
    logar(event) {
      if (event.key == 'Enter') {
        this.verificaCredenciais();
      }
    },
    fecharModal() {
      this.mensagemErro = '';
      this.mensagemAlerta = '';
      this.mensagemSucesso = '';
    },
    verificaCredenciais() {
      this.loading = true;
      this.mensagemAlerta = '';
      this.mensagemErro = '';
      this.mensagemSucesso = '';
      axios.post(`${store.state.apiUrl}/login`, {
        email: this.email.trim(),
        senha: this.senha.trim(),
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async (response) => {
            location.reload()
        })
        .catch((error) => {
          if(error.response.data){
            if (error.response.data.message) {
            this.mensagemErro = error.response.data.message[0];
          } else {
            this.mensagemErro = error.response.data;
          }
          }else{
            this.mensagemErro = "Algo deu errado.";
          }
         
          this.loading = false;
        });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.voltar {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 5%;
  align-items: center;
  left: 10%;
  background: none;
  border: none;
  color: var(--cor-branco);
  transition: 0.3s ease-in-out;
}

.voltar img {
  width: 15px;
  filter: invert(100%);
  margin-right: 5%;
}

.voltar:hover {
  margin-left: 5px;
}

.password-container {
  position: relative;
  width: 100%;
}

.password-container input {
  width: 100%;
  padding-right: 50px !important;
  box-sizing: border-box;
}



.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--cor-branco);
  cursor: pointer;
  outline: none;
  padding: 5px;
}

.toggle-password img {
  width: 25px;
}

.textfield>input::placeholder {
  color: #00000094;
}

.fieldText {
  color: var(--cor-branco);
}

.fieldText a {
  color: var(--cor-secundaria);
}


.main-login {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-login {
  width: 50vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.left-login img {
  width: 30rem;
  text-align: center;
  margin: 5% 0;
}

.left-login>h1 {
  color: var(--cor-branco);
  font-size: 2.5vw;
  margin: 5% 0;
}

.left-login-image {
  width: 35vw;
}

.right-login {
  width: 50vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-login {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px 35px;
  background: var(--cor-preto);
  border-radius: 20px;
  box-shadow: 0px 10px 40px #00000056;
}

.card-login>h1 {
  color: var(--cor-branco);
  font-weight: 800;
  margin: 0;
}

.textfield {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 10px 0px;
}

.textfield>input,
.textfield .password-container>input {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 15px;
  color: #000;
  font-size: 12pt;
  box-shadow: 0px 10px 40px #00000056;
  outline: none;
  box-sizing: border-box;
}

.textfield>label {
  color: #f0ffffde;
  margin-bottom: 10px;
}

.textfield>input::placeholder {
  color: #00000094;
}

.btn-login {
  width: 100%;
  padding: 16px 0;
  margin: 25px;
  border: none;
  border-radius: 8px;
  outline: none;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 3px;
  color: var(--cor-branco);
  background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
  border: 1px solid var(--cor-principal);
  cursor: pointer;
  transition: 0.5s ease-in-out;
}

.btn-login:hover{
  background: var(--cor-branco);
  color: var(--cor-principal);
}

.forgot {
  opacity: 0.8;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s ease-in-out
}

.forgot:hover {
  opacity: 1;
}

@media only screen and (max-width: 1100px) {
  .left-login img {
    width: 20rem;
  }
}


@media only screen and (max-width: 950px) {
  .card-login {
    width: 85%;
  }
}

@media only screen and (max-width: 600px) {
  .main-login {
    flex-direction: column;
  }

  .left-login>h1 {
    display: none;
  }

  .left-login img {
    width: 15rem;
  }

  .left-login {
    width: 100%;
    height: auto;
  }

  .right-login {
    width: 100%;
    height: auto;
  }

  .left-login-image {
    width: 40vh;
  }

  .card-login {
    width: 90%;
  }
}
</style>
