<template>
    <div v-if="showForgotPassowrd" class="popup-container">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="fecharModal">&times;</button>
            <h2>Atualizar Senha</h2>

            <div v-if="step === 1">
                <label for="email">Email</label>
                <div><input type="email" v-model="email" @keyup.enter="sendVerificationCode"
                        placeholder="Digite seu email"></div>
                <button @click="sendVerificationCode">Enviar Código</button>
            </div>

            <div v-if="step === 2">
                <div>Código enviado! Verifique seu e-mail e o lixo eletrônico.</div>
                <label for="verificationCode">Código de Verificação</label>
                <div><input type="text" v-model="verificationCode" @keyup.enter="verifyCode"
                        placeholder="Digite o código enviado por email">
                </div>

                <button @click="verifyCode">Verificar Código</button>
            </div>

            <div v-if="step === 3">
                <label for="newPassword">Nova Senha</label>
                <div><input type="password" v-model="newPassword" @keyup.enter="updatePassword" placeholder="Digite sua nova senha">
                </div>
                <label for="confirmPassword">Confirmar Senha</label>
                <div>
                    <input type="password" v-model="confirmPassword" @keyup.enter="updatePassword" placeholder="Confirme sua nova senha">
                </div>
                <button @click="updatePassword">Atualizar Senha</button>
            </div>
        </div>
    </div>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharMensagem" />
</template>



<script>
import Mensagem from '../alertas/mensagensTemp.vue';
import axios from 'axios';
import store from '@/auth/autenticacao.js'
export default {
    components: {
        Mensagem,
    },
    emits: ['fecharForgotPassoword'],
    props: {
        emailUsado: {
            type: String,
            default: ''
        },
        showForgotPassowrd: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            step: 1,
            email: this.emailUsado,
            verificationCode: '',
            newPassword: '',
            confirmPassword: '',
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,

        };
    },
    mounted() {
        document.addEventListener('keydown', this.fecharComEsc);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.fecharComEsc);
    },
    methods: {
        fecharMensagem() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        fecharComEsc(event) {
            if (event.key === 'Escape') {
                this.fecharModal();
            }
        },
        async sendVerificationCode() {
            this.loading = true;
            if (this.email.length > 0) {
                await axios.post(`${store.state.apiUrl}/login/forgotPassword`, {
                    email: this.email,
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        this.step = 2;
                    })
                    .catch((error) => {
                        this.fecharMensagem()
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    });

            } else {
                this.fecharMensagem()
                this.mensagemAlerta = "Você precisa enviar um e-mail."
            }
            this.loading = false;

        },
        async verifyCode() {
            this.loading = true;
            if (this.verificationCode.length > 0) {
                await axios.get(`${store.state.apiUrl}/login/verifyCode/${this.verificationCode}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        this.step = 3;
                    })
                    .catch((error) => {
                        this.fecharMensagem()
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    });

            } else {
                this.fecharMensagem()
                this.mensagemAlerta = "Você precisa enviar um código."
            }
            this.loading = false;
        },
        fecharModal() {
            this.step = 1;
            this.verificationCode = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.$emit('fecharForgotPassoword');
        },
        async updatePassword() {
            this.loading = true;
            this.fecharMensagem()
            if (this.newPassword.length == 0) {
                this.mensagemAlerta = "Você precisa preencher a senha."
            }

            if (this.confirmPassword.length == 0) {
                this.mensagemAlerta = "Você precisa confirmar a senha."
            }

            if (this.newPassword === this.confirmPassword) {
                await axios.post(`${store.state.apiUrl}/login/changePassword/${this.verificationCode}`, {
                    email: this.email,
                    senha: this.newPassword
                },{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        
                        this.fecharMensagem()
                        this.mensagemSucesso = "Senha atualizada com sucesso!"

                    })
                    .catch((error) => {
                        this.fecharMensagem()
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    });

            } else {
                this.fecharMensagem()
                this.mensagemErro = "As senhas não coincidem"
            }
            
            this.loading = false;
        }
    }
};
</script>


<style scoped>
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
}

.popup-content {
    position: relative;
    background: #f2f2f2;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 30%;
    text-align: right;
    color: var(--cor-preto);
    z-index: 1001;
}

.popup-content div div {
    text-align: left;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    border: none !important;
    color: var(--cor-preto) !important;
    background: none !important;
}

.popup-content h2 {
    margin-bottom: 20px;
    color: var(--cor-preto);
    text-align: left;
}

.popup-content label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: var(--cor-preto);
    text-align: left;
}

.popup-content input {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 10px;
    color: var(--cor-preto);
}

.popup-content button {
    padding: 10px 15px;
    border: none;
    border-radius: 15px;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco);
    border: 1px solid var(--cor-principal);
    cursor: pointer;
    transition: 0.5s ease-in-out;
}

.popup-content button:hover {
   background: transparent;
   color: var(--cor-principal);
}

.loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #37373763;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999999999999999999999;
    color: var(--textColor-title);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--cor-principal);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 1220px){
    .popup-content{
        width: 70%;
    }
}

@media (max-width: 600px){
    .popup-content{
        width: 95%;
    }
}
</style>
