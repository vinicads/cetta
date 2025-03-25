<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">Informações pessoais - {{ perfil }}</div>
        <avalicaoComponent :note="notaRecrutador" v-if="perfil == 'Recrutador'" :idRecrutador="autenticacao.idConta" />
        <i class="fas fa-edit" @click="modoEdicao = true" v-if="!modoEdicao"></i>
        <div class="info">
            <div class="imagem">
                <img :src="fotoCompleta" v-if="foto != 'semFoto'" alt="">
                <img src="../../../../assets/icons/semFoto.png" v-else alt="">
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
                <div class="overlay" @click="openFileInput">
                    <i class="fas fa-camera"></i>
                </div>
            </div>
            <div class="grid-info">
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Nome</label>
                    <input type="text" class="form-control" :disabled="!modoEdicao" id="nome" v-model="nome"
                        maxlength="45" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Documento - {{ tipoDocumento }}</label>
                    <input type="text" class="form-control" :disabled="!modoEdicao" id="documento"
                        :maxlength="tipoDocumento == 'CNPJ' ? 18 : 14" v-model="documento"
                        @input="mascaraDocumentoInput" @paste="colarDocumentoInput" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Telefone</label>
                    <input type="text" class="form-control" @input="mascaraTelefoneInput" @paste="colarTelefoneInput"
                        :disabled="!modoEdicao" id="contato" v-model="contato" maxlength="14" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">CEP</label>
                    <input type="text" class="form-control" :disabled="!modoEdicao" @input="mascaraCEPInput"
                        @paste="colarCEPInput" id="cep" v-model="cep" maxlength="9" required>
                </div>
                <div class="form-group" style="text-align: left;" :disabled="!modoEdicao" v-if="perfil == 'Motorista'">
                    <label>Tipo de veículo</label>
                    <div>
                        <label for="CargaSeca" class="radio-label">
                            <input type="radio" id="CargaSeca" :disabled="!modoEdicao" value="CargaSeca" v-model="tipoVeiculo"> Carga Seca
                        </label>
                    </div>
                    <div>
                        <label for="Refrigerado" class="radio-label">
                            <input type="radio" id="Refrigerado" :disabled="!modoEdicao" value="Refrigerado" v-model="tipoVeiculo"> Refrigerado
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;" :disabled="!modoEdicao" v-if="perfil == 'Motorista'">
                    <label>Possui MEI</label>
                    <div>
                        <label for="mei_sim" class="radio-label">
                            <input type="radio" id="mei_sim" :disabled="!modoEdicao" value="true" v-model="mei"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="mei_nao" class="radio-label">
                            <input type="radio" id="mei_nao" :disabled="!modoEdicao" value="false" v-model="mei"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;" v-if="perfil == 'Motorista'">
                    <label>Possui ANTT</label>
                    <div>
                        <label for="antt_sim" class="radio-label">
                            <input type="radio" id="antt_sim" :disabled="!modoEdicao" value="true" v-model="antt"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="antt_nao" class="radio-label">
                            <input type="radio" id="antt_nao" :disabled="!modoEdicao" value="false" v-model="antt"> Não
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="buttons" v-if="modoEdicao">
            <button class="cancelar" @click="carregarDados(1)">Cancelar</button>
            <button class="atualizar" @click="updateAccount">Atualizar</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import avalicaoComponent from './perfilsComponents/avalicaoComponent.vue'
import popupCarregamentoTemp from '../../../popups/popupCarregamentoTemp.vue'
import Mensagem from '../../../alertas/mensagensTemp.vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        avalicaoComponent
    },
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            autenticacao: store.state.autenticacao,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            modoEdicao: false,
            nome: '',
            documento: '',
            tipoDocumento: '',
            contato: '',
            cep: '',
            antt: '',
            tipoVeiculo: '',
            mei: '',
            foto: '',
            fotoCompleta: '',
            loading: false,
            notaRecrutador: 0,
        }
    },
    mounted() {
        this.carregarDados(0)
    },
    methods: {
        carregarDados(index) {
            this.modoEdicao = false;
            this.nome = this.autenticacao.conta.nome;
            this.tipoDocumento = this.autenticacao.conta.tipoDocumento;
            if (this.tipoDocumento == 'CPF') {
                this.documento = colarCPF(this.autenticacao.conta.documento);
            } else {
                this.documento = colarCNPJ(this.autenticacao.conta.documento);
            }
            this.contato = colarCelular(this.autenticacao.conta.contato);
            this.cep = colarCEP(this.autenticacao.conta.cep);

            if (index != 1) {
                this.foto = this.autenticacao.conta.foto;
                this.fotoCompleta = `${this.apiUrl}/public/files/${this.foto}`
            }
            if (this.perfil == 'Motorista') {
                this.antt = this.autenticacao.conta.antt;
                this.mei = this.autenticacao.conta.mei;
                this.tipoVeiculo = this.autenticacao.conta.tipoVeiculo;
            }

            if (this.perfil == 'Recrutador') {
                this.verificarNota()
            }
        },
        async verificarNota() {
            try {
                const response = await axios.get(`${this.apiUrl}/avaliacoes/${this.autenticacao.idConta}`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    this.notaRecrutador = response.data.nota
                }
            } catch (error) {
                this.notaRecrutador = 0
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        mascaraDocumentoInput(event) {
            if (this.tipoDocumento == 'CNPJ') {
                if (this.documento.length == 18) {
                    this.documento = colarCNPJ(this.documento, event)
                } else {
                    this.documento = MascaraCNPJ(this.documento.replace(/\s/g, ''), event);
                }
            } else {
                if (this.documento.length == 14) {
                    this.documento = colarCPF(this.documento, event)
                } else {
                    this.documento = MascaraCPF(this.documento.replace(/\s/g, ''), event);
                }
            }

        },
        colarDocumentoInput(event) {
            if (this.tipoDocumento == 'CNPJ') {
                var aux = colarCNPJ(event.clipboardData.getData('text').replace(/\s/g, ''), event);
                this.documento = aux;
            } else {
                var aux = colarCPF(event.clipboardData.getData('text').replace(/\s/g, ''), event);
                this.documento = aux;
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
            if (this.contato.length == 14) {
                this.contato = colarCelular(this.contato, event)
            } else {
                this.contato = MascaraCelular(this.contato.replace(/\s/g, ''), event);
            }
        },
        colarTelefoneInput(event) {
            var aux = colarCelular(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.contato = aux;
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.uploadFile(file);
        },
        async updateAccount() {
            try {
                this.loading = true;
                this.fecharModal()


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

                if (this.contato) {
                    telefone = RemoveMascaraContato(this.contato)
                }

                let mei, antt
                if (this.perfil == 'Motorista') {
                    if (this.antt) {
                        antt = this.antt === 'true';
                    }

                    if (this.mei) {
                        mei = this.mei === 'true';
                    }
                }


                const data = {

                    "autenticacao": {
                        "email": this.autenticacao.email,
                    },
                    "conta": {
                        "nome": this.nome,
                        "tipoDocumento": this.tipoDocumento,
                        "documento": documento,
                        "cep": cep,
                        "antt": antt,
                        "mei": mei,
                        "tipoVeiculo": this.tipoVeiculo,
                        "contato": telefone,
                        "perfil": this.perfil,
                    }
                }
                await axios.put(`${store.state.apiUrl}/users/${this.autenticacao.idAutenticacao}`,
                    data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(async (response) => {
                        this.loading = false;
                        this.fecharModal()
                        this.mensagemSucesso = "Conta atualizada com sucesso."
                        this.modoEdicao = false;
                    })
                    .catch((error) => {
                        this.fecharModal();
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                        this.loading = false;
                    });
            } catch (error) {
                console.log(error)
            }

        },
        async uploadFile(file) {
            const formData = new FormData();
            if (!file) {
                this.mensagemAlerta = "Você precisa enviar um arquivo.";
                return;
            }
            formData.append('arquivos', file);
            await axios.put(`${store.state.apiUrl}/users/changePerfil/${this.autenticacao.idConta}`,
                formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(async (response) => {
                    this.fecharModal();
                    this.mensagemSucesso = response.data;
                    const newImageUrl = URL.createObjectURL(file);
                    this.fotoCompleta = newImageUrl;
                })
                .catch((error) => {
                    this.fecharModal();
                    if (error.response.data.message) {
                        this.mensagemErro = error.response.data.message[0];
                    } else {
                        this.mensagemErro = error.response.data;
                    }
                })
        },
    }
}
</script>

<style scoped>
.containerSmall {
    width: 95%;
    border-radius: 15px;
    padding: 5%;
    background-color: #F2F2F2;
    margin: 5rem auto;
    position: relative;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.title {
    font-size: 2rem;
    color: var(--cor-preto);
    font-weight: bold;
    text-align: left;
    margin-bottom: 1rem;
    width: 80%;
}

.info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: center;
    align-items: start;
}

.imagem {
    width: 100%;
    max-width: 15rem;
    height: 15rem;
    position: relative;
}

.imagem img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background-position: center;
    background-color: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.overlay i {
    font-size: 2rem;
    color: #fff;
}

.imagem:hover .overlay {
    opacity: 1;
    cursor: pointer;
}

.grid-info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.fa-edit {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 2rem;
    cursor: pointer;
    color: var(--cor-preto);
    
}

.fa-edit:hover {
    transform: scale(1.02);

}

.buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: end;
    gap: 15px;
}

.buttons button {
    border-radius: 15px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--cor-branco);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.cancelar {
    padding: 1rem;
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
}

.atualizar {
    padding: 1rem 2rem;
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
}

.atualizar:hover {
    background-color: transparent;
    color: var(--cor-principal);
}

.cancelar:hover {
    background-color: transparent;
    color: var(--cor-preto);
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

.radio-label {
    display: flex;
    align-items: center;
    gap: 10px;
}

@media (min-width: 768px) {
    .info {
        grid-template-columns: 30% 70%;
    }

    .grid-info {
        grid-template-columns: 1fr 1fr;
    }

    .form-group {
        flex-direction: column;
        align-items: start;
    }

    .form-group label {
        flex: 1;
        text-align: right;
        margin-right: 1rem;
    }

    .form-group input {
        flex: 2;
    }

    .title {
        text-align: left;
        font-size: 3rem;
    }

    .containerSmall {
        width: 100%;
    }
}

@media (min-width: 1200px) {
    .grid-info {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .info {
        grid-template-columns: 20% 80%;
        align-items: center;
        justify-items: center;
    }

}
</style>
