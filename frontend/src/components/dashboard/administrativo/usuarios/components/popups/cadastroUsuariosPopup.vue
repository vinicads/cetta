<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Cadastro de Usuários</h2>
            <div class="form-group">

                <label for="modelo">Perfil</label>
                <select id="perfil" class="form-control" @change="verificaTipoDocumento" v-model="perfil" required>
                    <option class="select-option" value="Motorista">Motorista </option>
                    <option class="select-option" value="Empresa">Empresa</option>
                    <option class="select-option" value="Recrutador">Recrutador</option>
                    <option class="select-option" value="Admin">Admin</option>
                </select>
            </div>
            <div class="form-container">
                <div class="form-group">

                    <label for="modelo">Nome</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarUsuario" id="nome" v-model="nome"
                        maxlength="45" required>
                </div>
                <div class="form-group">
                    <label for="documento">Documento</label>
                    <input id="documento" type="text" v-model="documento" name="documento"
                        :maxlength="tipoDocumento == 'CPF' ? 14 : 18" @keyup.enter="cadastrarUsuario"
                        @input="mascaraDocumentoInput" @paste="colarDocumentoInput" required>
                </div>
                <div class="form-group">
                    <label for="cep">CEP</label>
                    <input id="cep" type="cep" name="cep" v-model="cep" @keyup.enter="cadastrarUsuario" maxlength="9"
                        @input="mascaraCEPInput" @paste="colarCEPInput" required>
                </div>
                <div class="form-group">
                    <label for="telefone">Celular</label>
                    <input id="telefone" type="telefone" maxlength="14" @keyup.enter="cadastrarUsuario"
                        v-model="telefone" name="telefone" @input="mascaraTelefoneInput" @paste="colarTelefoneInput"
                        required>
                </div>
                <div class="form-group" v-if="perfil == 'Motorista'">
                    <label for="tipoVeiculo">Tipo de veículo</label>
                    <div class="radioGroup">
                        <div class="radio"> <input id="CargaSeca" type="radio" v-model="tipoVeiculo" name="CargaSeca" value="CargaSeca"
                                required> Carga Seca</div>
                        <div class="radio"> <input id="Refrigerado" type="radio" v-model="tipoVeiculo" name="Refrigerado" value="Refrigerado"
                                required> Refrigerado</div>
                    </div>
                </div>
                <div class="form-group" v-if="perfil == 'Motorista'">
                    <label for="antt">ANTT</label>
                    <div class="radioGroup">
                        <div class="radio"> <input id="anttT" type="radio" v-model="antt" name="antt" value="true"
                                required> Sim</div>
                        <div class="radio"> <input id="anttF" type="radio" v-model="antt" name="antt" value="false"
                                required> Não</div>
                    </div>
                </div>
                <div class="form-group" v-if="perfil == 'Motorista'">
                    <label for="firstname">MEI</label>
                    <div class="radioGroup">
                        <div class="radio"> <input id="meiT" type="radio" v-model="mei" value="true" name="mei"
                                required> Sim</div>
                        <div class="radio"> <input id="meiF" type="radio" v-model="mei" name="mei" value="false"
                                required> Não</div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input id="email" type="text" name="email" @keyup.enter="cadastrarUsuario" v-model="email" required>
                </div>
                <div class="form-group">
                    <label for="senha">Senha</label>
                    <input id="senha" type="password" v-model="senha" @keyup.enter="cadastrarUsuario" name="senha"
                        required>
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">Cancelar</button>
                <button @click="cadastrarUsuario">Cadastrar</button>
            </div>
        </div>
    </div>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
</template>




<script>
import store from '@/auth/autenticacao';
import axios from 'axios';
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, MascaraCNPJ, colarCNPJ, retornaCidade, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    emits: ['close'],
    props: {
        showCadastroPlanosPopup: Boolean
    },
    components: {
        Mensagem,
        popupCarregamentoTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            nome: '',
            documento: '',
            tipoDocumento: 'CPF',
            perfil: 'Recrutador',
            cep: '',
            telefone: '',
            foto: 'semFoto',
            antt: '',
            mei: '',
            tipoVeiculo: '',
            email: '',
            senha: '',
            loading: false,
        }
    },
    methods: {
        verificaTipoDocumento() {
            if (this.perfil == 'Empresa') {
                this.tipoDocumento = 'CNPJ'
            } else {
                this.tipoDocumento = 'CPF'
            }
            if (this.documento) {
                this.documento = ''
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        mascaraDocumentoInput(event) {
            if (this.tipoDocumento == 'CPF') {
                if (this.documento.length == 14) {
                    this.documento = colarCPF(this.documento, event)
                } else {
                    this.documento = MascaraCPF(this.documento.replace(/\s/g, ''), event);
                }
            } else {
                if (this.documento.length == 18) {
                    this.documento = colarCNPJ(this.documento, event)
                } else {
                    this.documento = MascaraCNPJ(this.documento.replace(/\s/g, ''), event);
                }
            }

        },
        colarDocumentoInput(event) {
            if (this.tipoDocumento == 'CPF') {
                var aux = colarCPF(event.clipboardData.getData('text').replace(/\s/g, ''), event);
                this.documento = aux;
            } else {
                var aux = colarCNPJ(event.clipboardData.getData('text').replace(/\s/g, ''), event);
                this.documento = aux;
            }

        },
        colarDocumentoRetorno(documento) {
            if (this.tipoDocumento == 'CPF') {
                var aux = colarCPF(documento, event);
                return aux
            } else {
                var aux = colarCNPJ(documento, event);
                return aux
            }

        },
        mascaraCEPInput(event) {
            if (this.cep.length == 9) {
                this.cep = colarCEP(this.cep, event)
            } else {
                this.cep = MascaraCEP(this.cep.replace(/\s/g, ''), event);
            }
        },
        colarCEPInput(event) {
            var aux = colarCEP(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.cep = aux;
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
        async cadastrarUsuario() {
            this.loading = true;
            this.mensagemAlerta = '';
            this.mensagemErro = '';
            this.mensagemSucesso = '';


            let cep, documento, telefone
            if (this.cep) {
                cep = RemoveMascaraCEP(this.cep)
                let verifica = await verificaCEP(cep)

                if (!verifica) {
                    this.fecharModal()
                    this.mensagemErro = "Insira um CEP valido.";
                    this.loading = false;
                    return;
                }
            }

            if (this.documento) {
                if (this.tipoDocumento == 'CNPJ') {
                    documento = RemoveMascaraCNPJ(this.documento)
                } else {
                    documento = RemoveMascaraCPF(this.documento)
                }

            }

            if (this.telefone) {
                telefone = RemoveMascaraContato(this.telefone)
            }

            let mei, antt, tipoVeiculo


            if (this.perfil == 'Motorista') {
                if (!this.mei || !this.antt) {
                    this.mensagemErro = 'ANTT e MEI devem ser preenchidos no perfil motorista.';
                    this.loading = false;
                    return;
                }

                if (!this.tipoVeiculo){
                    this.mensagemErro = 'Tipo de veículo deve ser preenchido no perfil motorista';
                    this.loading = false;
                    return;
                }
                if (this.antt) {
                    antt = this.antt === 'true';
                }

                if (this.mei) {
                    mei = this.mei === 'true';
                }

                if (this.tipoVeiculo){
                    tipoVeiculo = this.tipoVeiculo
                }
            } else {
                antt = null;
                mei = null;
            }


            const data = {

                "autenticacao": {
                    "email": this.email,
                    "senha": this.senha
                },
                "conta": {
                    "nome": this.nome,
                    "tipoDocumento": this.tipoDocumento,
                    "documento": documento,
                    "cep": cep,
                    "contato": telefone,
                    "foto": this.foto,
                    "perfil": this.perfil,
                    "antt": antt,
                    "mei": mei,
                    "tipoVeiculo": tipoVeiculo
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
                    this.mensagemSucesso = "Conta criada com sucesso"
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
        closePopup() {
            this.$emit('close');
        },
        closePopupOnOverlay(event) {
            if (event.target === event.currentTarget) {
                this.closePopup();
            }
        },
        onEscKey(event) {
            if (event.key === 'Escape') {
                this.closePopup();
            }
        },
    },
    mounted() {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
    }
}
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
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 95%;
    max-width: 600px;
    text-align: left;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    color: var(--cor-preto);
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--cor-texto);
}

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55, 55, 55, 0.39);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
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

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    height: 80%;
}

.form-group label {
    margin-bottom: 5px;
}

.form-group input,
.form-group select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    transition: 0.5s ease-in-out;
}

.form-group select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    cursor: pointer;
}

.form-group select .select-option {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

.select-option:hover {
    background-color: var(--cor-principal) !important;
}

.buttons {
    display: flex;
    justify-content: end;
    margin-top: 20px;
    width: 100%;
    gap: 1%;
}

.buttons button {
    border-radius: 15px;
    border: none;
    color: white;
    padding: 10px;
    width: 20%;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:last-of-type {
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
}

.buttons button:last-of-type:hover {
    background-color: var(--cor-branco);
    color: var(--cor-principal);
}

.buttons button:first-of-type {
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
}

.buttons button:first-of-type:hover {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

.radioGroup {
    width: auto;
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

input[type="radio"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--cor-principal);
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

input[type="radio"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

@media(max-width:1064px) {
    .input-box {
        width: 100%;
    }
}

@media (min-width: 768px) {
    .form-container {
        grid-template-columns: 1fr 1fr;
    }

    .form-group {
        margin-bottom: 0;
    }

    .form-group:nth-child(odd) {
        margin-right: 15px;
    }
}

@media (max-width: 767px) {
    .popup-content {
        width: 95%;
        height: auto;
        overflow-y: auto;
        padding: 10px;
    }

    h2 {
        font-size: 1.2rem;
    }

    .buttons {
        flex-direction: column;
        gap: 10px;
    }

    .buttons button {
        width: 100%;
    }
}
</style>
