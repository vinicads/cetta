<template>
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="footer-col">
                    <h4>Encontrando Fretes</h4>
                    <ul>
                        <li><a>Encontramos sempre o melhor frete perto de você.</a></li>

                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Redes sociais</h4>
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=61561813703361" target="_blank"><i
                                class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/encontrandofretes?utm_source=qr&igsh=MTdqdTU4Mms1ZjRhaQ%3D%3D" target="_blank"><i
                                class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Contato</h4>
                    <ul>
                        <li :class="loading ? 'loading' : ''"><a :href="`tel:+55${telefone}`"><img src="../../assets/icons/telefone.png" alt="">{{ telefone ? mascaraTelefone(telefone) : "Não foi possível carregar." }}</a></li>
                        <li :class="loading ? 'loading' : ''"><a :href="`mailto:${email}`"><img src="../../assets/icons/email.png"
                                    alt="">{{ email ? email : "Não foi possível carregar." }}</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Navegar</h4>
                    <ul v-if="!isAuthenticated">
                        <li><router-link to="/planos">Planos</router-link></li>
                        <li><router-link to="/fretes">Fretes</router-link></li>
                        <li><router-link to="/recrutadores">Recrutadores</router-link></li>
                        <li><router-link to="/cadastro/empresa">Para Empresas</router-link></li>
                        <li><router-link to="/cadastro/motorista">Para Motoristas</router-link></li>
                        <li><router-link to="/login">Login</router-link></li>
                        <li><router-link to="/cadastroGeral">Cadastre-se</router-link></li>
                        <li><router-link to="/politicas">Politica de Privacidade e Termos de Uso</router-link></li>
                    </ul>
                    <ul v-if="isAuthenticated && perfil == 'Motorista'">
                        <li><router-link to="/fretes">Fretes</router-link></li>
                        <li><router-link to="/recrutadores">Recrutadores</router-link></li>
                        <li><router-link to="/meuPerfil">Meu Perfil</router-link></li>
                        <li><router-link to="/politicas">Politica de Privacidade e Termos de Uso</router-link></li>
                    </ul>
                    <ul v-if="isAuthenticated && perfil == 'Empresa'">
                        <li><router-link to="/planos">Planos</router-link></li>
                        <li><router-link to="/fretes">Fretes</router-link></li>
                        <li><router-link to="/recrutadores">Recrutadores</router-link></li>
                        <li><router-link to="/meuPerfil">Meu Perfil</router-link></li>
                        <li><router-link to="/politicas">Politica de Privacidade e Termos de Uso</router-link></li>
                    </ul>
                    <ul v-if="isAuthenticated && perfil == 'Recrutador'">
                        <li><router-link to="/fretes">Fretes</router-link></li>
                        <li><router-link to="/meuPerfil">Meu Perfil</router-link></li>
                        <li><router-link to="/politicas">Politica de Privacidade e Termos de Uso</router-link></li>
                    </ul>
                    <ul v-if="isAuthenticated && perfil == 'Admin'">
                        <li><router-link to="/fretes">Fretes</router-link></li>
                        <li><router-link to="/admin/planos">Planos</router-link></li>
                        <li><router-link to="/admin/usuarios">Usuários</router-link></li>
                        <li><router-link to="/admin/geral">Sistema</router-link></li>
                        <li><router-link to="/politicas">Politica de Privacidade e Termos de Uso</router-link></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    <div class="footerCopyight">Copyright © &nbsp; <label for=""> Encontrando Fretes.</label></div>
    <button class="floating-button" v-if="telefone" @click="sendMessageWpp">
        <i class="fab fa-whatsapp" aria-hidden="true"></i>
    </button>
</template>


<script>
import { useRoute } from 'vue-router';
import axios from 'axios';
import store from '@/auth/autenticacao.js'
import { colarCelular } from '../../utils/utils'
export default {
  data() {
    return {
      apiUrl: store.state.apiUrl,
      isVerified: store.state.isVerified,
      perfil: store.state.perfil,
      isAuthenticated: store.state.isAuthenticated,
      telefone: '',
      email: '', 
      loading: false,
      semResultado: false,
    };
  },
  watch: {
    '$store.state.isVerified'(newItem, oldItem) {
      this.isAuthenticated = store.state.isAuthenticated;
      this.perfil = store.state.perfil;
      this.isVerified = newItem;
    },
  },
  methods: {
    async sendMessageWpp() {
                try {
                    var number = "+5511977663280";
                    let mensagem = "Olá, estava pelo site e resolvi te enviar uma mensagem.";

                    var link = "https://api.whatsapp.com/send?phone=" + number + "&text=" + encodeURIComponent(mensagem);

                    window.open(link);
                } catch (error) {
                    console.log(error)
                }
                 

        },
    mascaraTelefone(cel){
        return colarCelular(cel)
    },
    async verificarDados(){
        this.loading = true;
        this.semResultado = false;
        await axios.get(`${store.state.apiUrl}/public/infoGeral`, {
          withCredentials: true,
        })
        .then((response) => {
            this.telefone = response.data.numeroContato
            this.email = response.data.emailContato
        })
        .catch((error) => {
            this.semResultado = true;
        });
        this.loading = false;
    }
  },

  mounted() {
  this.verificarDados()
},

};
</script>

<style scoped>


.container {
    max-width: 80%;
    margin: auto;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

ul {
    list-style: none;
}

.footer {
    background-color: var(--cor-preto);
    padding: 70px 0;
}

.footer-col {
    width: 25%;
    padding: 0 15px;
}

.footer-col:first-child a{
    width: 75%;
}


a img {
    width: 15px;
    margin-right: 3%;
}

.footer-col h4 {
    font-size: 18px;
    color: #ffffff;
    text-transform: capitalize;
    margin-bottom: 35px;
    font-weight: 500;
    position: relative;
}

.footer-col h4::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    background-color: var(--cor-preto-secundaria);
    height: 2px;
    box-sizing: border-box;
    width: 50px;
}

.footer-col ul li:not(:last-child) {
    margin-bottom: 10px;
}

.footer-col ul li a {
    font-size: 16px;
    color: #ffffff;
    text-decoration: none;
    font-weight: 300;
    color: #d9d9d9;
    display: block;
    transition: all 0.3s ease;
}

.footer-col ul li a:hover {
    color: #ffffff;
}

.footer-col .social-links a {
    display: inline-block;
    height: 40px;
    width: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 10px 10px 0;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    color: #ffffff;
    transition: all 0.5s ease;
}

.footer-col .social-links a:hover {
    color: #24262b;
    background-color: #ffffff;
}

.footerCopyight {
    border-top: 1px solid #cccccc;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--cor-preto);
    font-size: 12px;
    padding: 1.5rem;
    color: #cccccc;
    font-weight: 100;
    width: 100%;
    text-align: center;
}

.footerCopyight label {
    margin: 0;
    color: #fff;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 20px;
  background-color: var(--cor-principal);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 2rem;
  z-index: 10;
}

.floating-button:hover{
    background-color: var(--cor-secundaria);
}

@media(max-width: 1640px) {
    .footer-col {
        width: 50%;
        margin-bottom: 30px;
    }
}

@media(max-width: 822px) {
    .container {
        max-width: 100%;
    }
}

@media(max-width: 739px) {
    .footer {
        padding: 0;
        padding-top: 20px;
    }

    .footer-col {
        width: 100%;
    }

    .footer-col:first-child a{
    width: 100%;
}

    .footer-col ul li a {
        font-size: 12px;
    }
}
</style>