<template>
    <popupCarregamentoTemp v-if="loading" />
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="main-login">
        <router-link to="/">
            <button class="voltar"><img src="../../assets/icons/back.png" alt="">Voltar</button>
        </router-link>
        <div class="container">
            <div class="form-image">
                <img src="../../assets/images/cadastrese.jpg" alt="">
            </div>
            <div class="form">
                <form @submit="handleSubmit">
                    <div class="form-header">
                        <div class="title">
                            <h1>Cadastre-se</h1>
                        </div>

                    </div>

                    <div class="input-group">
                        <div class="input-box">
                            <label for="firstname">Nome completo</label>
                            <input id="firstname" type="text" v-model="nome" maxlength="45" name="nome"
                                placeholder="Digite seu nome completo" required>
                        </div>

                        <div class="input-box">
                            <label for="number">Celular</label>
                            <input id="number" type="telefone" maxlength="14" v-model="telefone" name="number"
                                @input="mascaraTelefoneInput" @paste="colarTelefoneInput" placeholder="(xx)xxxx-xxxx"
                                required>
                        </div>

                        <div class="input-box">
                            <label for="data_nasc">Data de nascimento</label>
                            <input id="data_nasc" type="date" v-model="data_nasc" name="data_nasc"
                                required>
                        </div>

                        <div class="input-box">
                            <label for="password">E-mail</label>
                            <input id="email" type="text" name="email" placeholder="Digite seu e-mail" v-model="email"
                                required>
                        </div>

                        <div class="input-box">
                            <label for="password">Senha</label>
                            <input id="password" type="password" v-model="senha" name="password"
                                placeholder="Digite sua senha" required>
                        </div>
                        <div class="termos">
                            <label>Ao se cadastrar, você concorda com os <router-link to="/politicas">termos e condições</router-link> e autoriza o sistema a salvar seus dados, utilizar cookies e alguns termos a mais.</label>

                            <div class="checkbox-group">
                                <label>

                                    <input type="checkbox" v-model="termos" /> Aceitar termos e condicoes
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="continue-button">
                        <button type="submit">Continuar</button>

                    </div>
                    <div class="jacadastrado"> Já possui cadastro?  <router-link to="/login">Clique aqui.</router-link>
                    </div>
                </form>
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
import popupCarregamentoTemp from '../popups/popupCarregamentoGeralTemp.vue'
import forgotPassowordTemp from './forgotPassowordTemp.vue'
import { ref } from 'vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
    },
    data() {
        return {
            nome: '',
            perfil: 'Usuario',
            data_nasc: '',
            telefone: '',
            foto: 'semFoto',
            email: '',
            termos: false,
            senha: '',
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false
        }
    },
    methods: {
        handleSubmit(event) {
            event.preventDefault();
            this.cadastro()
        },
        mascaraTelefoneInput(event) {
            if (this.telefone.length == 14) {
                this.telefone = colarCelular(this.telefone, event)
            } else {
                this.telefone = MascaraCelular(this.telefone.replace(/\s/g, ''), event);
            }
        },
        colarTelefoneInput(event) {
            var aux = colarCelular(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.telefone = aux;
        },
        cadastrar(event) {
            if (event.key == 'Enter') {
                this.cadastro();
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async cadastro() {
            if (!this.termos) {
                this.fecharModal()
                this.mensagemErro = "Aceite os termos antes de se cadastrar.";
                this.loading = false;
                return;
            }
            this.loading = true;
            this.mensagemAlerta = '';
            this.mensagemErro = '';
            this.mensagemSucesso = '';


            let telefone

            if (this.telefone) {
                telefone = RemoveMascaraContato(this.telefone)
            }


            const data = {

                "autenticacao": {
                    "email": this.email.trim(),
                    "senha": this.senha.trim()
                },
                "conta": {
                    "nome": this.nome.trim(),
                    "data_nasc": this.data_nasc,
                    "celular": telefone,
                    "foto": this.foto,
                    "perfil": this.perfil
                }
            }
            await axios.post(`${store.state.apiUrl}/users`,
                data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.fecharModal()
                    window.location.reload();
                })
                .catch((error) => {

                    resetFieldBorders();
                    if (error.response.data.message) {
                        if (typeof (error.response.data.message) == 'string') {
                            var mensagem = error.response.data.message;
                        } else {
                            var mensagem = error.response.data.message[0];
                        }
                    } else {
                        var mensagem = error.response.data;
                    }
                    var field = fieldCollector(mensagem);
                    var mensagemLimpa = removeField(mensagem);
                    if (field) {
                        var campoField = document.getElementById(field)
                        if (campoField) {
                            campoField.style.border = '1px solid red'
                            campoField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            campoField.addEventListener('input', function () {

                                campoField.style.border = '';
                            });
                        }

                    }


                    this.mensagemErro = mensagemLimpa;
                    this.loading = false;
                });
        },
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
    left: 5%;
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

.main-login {
    width: 100vw;
    min-height: 100vh;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}


.container {
    width: 80%;
    height: auto;
    display: flex;
}

.form-image {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--cor-preto);
    padding: 1rem;
}

.form-image img {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    object-fit: cover;
}

.form {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 3rem;
}

.form-header {
    margin-bottom: 3rem;
    display: flex;
    justify-content: space-between;
}

.login-button {
    display: flex;
    align-items: center;
}

.login-button button {
    border: none;
    color: var(--cor-branco);
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    padding: 0.4rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.login-button button:hover {
    background: var(--cor-branco);
    color: var(--cor-principal);
}

.login-button button a {
    text-decoration: none;
    font-weight: 500;
    color: #fff;
}

.form-header h1::after {
    content: '';
    display: block;
    width: 5rem;
    height: 0.3rem;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    margin: 0 auto;
    position: absolute;
    border-radius: 10px;
}

.input-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1rem 0;
}

.input-box {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.1rem;
}

.radioGroup {
    width: 8rem;
}

.radioGroup .radio {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 10px;
}

.input-box input {
    margin: 0.6rem 0;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 10px;
    box-shadow: 1px 1px 6px #0000001c;
    font-size: 0.8rem;
}

.input-box input:hover {
    background-color: #eeeeee75;
}

.input-box input:focus-visible {
    outline: 1px solid var(--cor-principal);
}

.input-box label,
.gender-title h6 {
    font-size: 0.75rem;
    font-weight: 600;
    color: #000000c0;
}

.input-box input::placeholder {
    color: #000000be;
}

.gender-group {
    display: flex;
    justify-content: space-between;
    margin-top: 0.62rem;
    padding: 0 .5rem;
}

.gender-input {
    display: flex;
    align-items: center;
}

.gender-input input {
    margin-right: 0.35rem;
}

.gender-input label {
    font-size: 0.81rem;
    font-weight: 600;
    color: #000000c0;
}

.continue-button button {
    width: 100%;
    margin-top: 2.5rem;
    border: none;
    border: 1px solid var(--cor-principal);
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    padding: 0.62rem;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
}

.continue-button button:hover {
    background: var(--cor-branco);
    color: var(--cor-principal);
}

.continue-button button a {
    text-decoration: none;
    font-size: 0.93rem;
    font-weight: 500;
    color: #fff;
}

.jacadastrado a {
    color: var(--cor-principal);
}

.termos {
    margin: 0;
    font-size: 0.8rem;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    width: 100%;
}

.checkbox-group input[type="checkbox"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #00000031;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;
    accent-color: var(--cor-principal) !important;
    border-radius: none !important;
    margin-right: 2%;
}

.checkbox-group input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    accent-color: var(--cor-principal) !important;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

@media screen and (max-width: 1270px) {
    .form-image {
        width: 50%;
    }

    .container {
        width: 90%;
        height: 30rem;
    }

    .form {
        justify-content: start;
        height: 100%;
        width: 100%;
    }


    .form form {
        height: 100%;
        width: 100%;
    }

    .input-group {
        flex-direction: column;
        z-index: 5;
        width: 100%;
        height: 50%;
        padding-right: 1rem;
        overflow-y: scroll;
        flex-wrap: nowrap;
    }
}

@media screen and (max-width: 1064px) {
    .form-image {
        display: none;
    }




    .input-box {
        width: 100%;
    }

    .gender-inputs {
        margin-top: 2rem;
    }

    .gender-group {
        flex-direction: column;
    }

    .gender-title h6 {
        margin: 0;
    }

    .gender-input {
        margin-top: 0.5rem;
    }
}

@media screen and (max-width: 900px) {
    .container {
        height: 30rem;
        width: 90%;
    }

    .form {
        padding: 1rem;
    }

    .title h1 {
        font-size: 1.5rem !important;
    }

    .form form {
        width: 100%;
    }
}
</style>