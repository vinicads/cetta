<template>
    <div class="content">
        <button @click="$emit('back')" class="back-button"><img src="../../../assets/icons/back.png" alt=""></button>
        <div class="content-details">
            <h2>{{ selectedItem.name }}</h2>
            <div v-if="selectedItem.id == 1">
                <div>Você pode alterar seu e-mail e senha quando quiser.</div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" v-model="email" id="email" required />
                </div>
                <div class="form-group">
                    <label for="senha">Senha:</label>
                    <input type="password" v-model="senha" id="senha" required />
                </div>
                <div class="form-group">
                    <label for="novaSenha">Confirme a nova senha:</label>
                    <input type="password" v-model="novaSenha" id="novaSenha" required />
                </div>
                <div class="form-group">
                    <label for="perfil">Perfil:</label>
                    <input type="text" v-model="perfil" id="perfil" disabled />
                </div>
                <div class="buttons">
                    <button type="submit" @click="atualizarEmail" class="btn-submit">Atualizar dados</button>
                    <button @click="excluirConta" class="btn-delete">Excluir Conta</button>
                </div>
            </div>
            <div v-if="selectedItem.id == 2">
                <div v-if="assinatura">
                    {{ assinatura }}
                    <!-- <div class="assinatura-info">
                        <p><strong>Plano:</strong> {{ assinatura.plano }}</p>
                        <p><strong>Prazo:</strong> {{ formatData(assinatura.prazo) }}</p>
                        <p><strong>Fretes disponíveis:</strong> {{ assinatura.qtdeFretes }}</p>
                        <p><strong>Contatos disponíveis:</strong> {{ assinatura.qtdeContatos }}</p>
                        <p v-if="pagamentoAssinatura"><strong>Status do pagamento da assinatura:</strong> {{
                            pagamentoAssinatura }}</p>
                        <p v-if="pagamentoFrete"><strong>Status do pagamento do frete:</strong> {{ pagamentoFrete }}</p>
                        <p class="flex"><strong>Status:</strong> {{ assinatura.status }}
                        <div class="circle" :class="assinatura.status == 'Ativo' ? 'ativo' : 'inativo'"></div>
                        </p>
                    </div> -->
                </div>
                <div v-else>
                    <p>O usuário não tem nenhuma assinatura ativa.</p>
                </div>
            </div>
        </div>
    </div>
    <deleteContaPopup :data="dataExclusao" :showDeleteContaPopup="showDeleteContaPopup" v-if="showDeleteContaPopup"
        @close="showDeleteContaPopup = false;" />
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharMensagem" />
</template>

<script>
import store from '@/auth/autenticacao.js';
import axios from 'axios';
import deleteContaPopup from './popups/excluirContaPopup.vue';
import Mensagem from '@/components/alertas/mensagensTemp.vue';

export default {
    components: {
        deleteContaPopup,
        Mensagem
    },
    emits: ['back'],
    props: {
        selectedItem: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
            autenticacao: store.state.autenticacao,
            dadosPessoais: store.state.dadosPessoais,
            assinatura: store.state.assinatura,
            pagamentoAssinatura: store.state.pagamentoAssinatura,
            pagamentoFrete: store.state.pagamentoFrete,
            perfil: store.state.autenticacao.conta.perfil,
            email: store.state.autenticacao.email,
            senha: '',
            novaSenha: '',
            showDeleteContaPopup: false,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            dataExclusao: store.state.dadosPessoais,
        };
    },
    methods: {
        fecharMensagem() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async atualizarEmail() {
            if (!this.validarEmail(this.email)) {
                this.mensagemErro = 'Por favor, insira um email válido.';
                return;
            }

            if (this.senha) {
                if (this.senha.trim() != this.novaSenha.trim()) {
                    this.mensagemErro = 'As senhas devem ser iguais.';
                    return;
                }
            }
            try {
                const response = await axios.put(`${this.apiUrl}/users/atualizar/autenticacao`, {
                    senha: this.senha,
                    email: this.email
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.fecharMensagem();
                if (response.status == 200) {
                    this.mensagemSucesso = response.data;
                }
            } catch (error) {
                let mensagem;
                if(error.responde.data){
                    if (error.response.data.message) {
                    if (typeof (error.response.data.message) == 'string') {
                        mensagem = error.response.data.message;
                    } else {
                        mensagem = error.response.data.message[0];
                    }
                } else {
                    mensagem = error.response.data;
                }

                if (typeof (mensagem) == 'object') {
                    mensagem = 'Método não encontrado.';
                }

                this.mensagemErro = mensagem;
                }else{
                    this.mensagemErro = "Algo deu errado.";
                }
              
            }
        },
        formatData(dateString) {
            const date = new Date(dateString);

            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();

            return `${dia}/${mes}/${ano}`;
        },
        validarEmail(email) {
            const re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
            return re.test(email);
        },
        async excluirConta() {
            this.showDeleteContaPopup = true;
        }
    }
};
</script>


<style scoped>
.content {
    padding: 20px;
    width: 90%;
    overflow-y: auto;
}

.back-button {
    display: none;
    margin-bottom: 20px;
    background: none;
    border: none;
}

.back-button img {
    width: 15px;
}

.flex {
    display: flex;
    align-items: center;
    gap: 5px;
}

.content-details {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.circle.ativo {
    background-color: green;
}

.circle.inativo {
    background-color: red;
}

.buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-submit {
    background-color: var(--cor-preto);
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.3s ease-in-out;
}

.btn-delete {
    background-color: var(--cor-principal);
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.3s ease-in-out;
}

.btn-delete:hover,
.btn-submit:hover {
    transform: scale(1.01);
}

@media (max-width: 1120px) {
    .buttons {
        justify-content: center;
        flex-direction: column;
    }
}

@media (max-width: 767px) {
    .back-button {
        display: block;
    }

    .buttons {
        justify-content: space-between;
        flex-direction: row;
    }

    .content {
        padding: 2px;
        width: 100%;
    }

    .content-details{
        height: 70vh;
        overflow-y: auto;
    }
}

@media (max-width: 452px) {
    .buttons {
        justify-content: center;
        flex-direction: column;
    }
}
</style>
