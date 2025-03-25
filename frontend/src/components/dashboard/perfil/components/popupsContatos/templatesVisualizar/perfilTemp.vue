<template>
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">Informações do Motorista</div>
        <div class="info">
            <div class="imagem">
                <img :src="fotoCompleta" v-if="foto != 'semFoto'" alt="">
                <img src="@/assets/icons/semFoto.png" v-else alt="">
            </div>
            <div class="grid-info">
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Nome</label>
                    <input type="text" class="form-control" disabled="true" id="nome" v-model="nome"
                        maxlength="45" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">CPF</label>
                    <input type="text" class="form-control" disabled="true" id="documento"
                        maxlength="14" v-model="documento" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Telefone</label>
                    <input type="text" class="form-control"
                        disabled="true" id="contato" v-model="contato" maxlength="14" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">CEP</label>
                    <input type="text" class="form-control" disabled="true" id="cep" v-model="cep" maxlength="9" required>
                </div>
                <div class="form-group" style="text-align: left;" disabled="true">
                    <label>Tipo de veículo</label>
                    <div>
                        <label for="CargaSeca" class="radio-label">
                            <input type="radio" id="CargaSeca" disabled="true" value="CargaSeca" v-model="tipoVeiculo"> Carga Seca
                        </label>
                    </div>
                    <div>
                        <label for="Refrigerado" class="radio-label">
                            <input type="radio" id="Refrigerado" disabled="true" value="Refrigerado" v-model="tipoVeiculo"> Refrigerado
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;" disabled="true">
                    <label>Possui MEI</label>
                    <div>
                        <label for="mei_sim" class="radio-label">
                            <input type="radio" id="mei_sim" disabled="true" value="true" v-model="mei"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="mei_nao" class="radio-label">
                            <input type="radio" id="mei_nao" disabled="true" value="false" v-model="mei"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label>Possui ANTT</label>
                    <div>
                        <label for="antt_sim" class="radio-label">
                            <input type="radio" id="antt_sim" disabled="true" value="true" v-model="antt"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="antt_nao" class="radio-label">
                            <input type="radio" id="antt_nao" disabled="true" value="false" v-model="antt"> Não
                        </label>
                    </div>
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
import popupCarregamentoTemp from '../../../../../popups/popupCarregamentoTemp.vue'
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        popupCarregamentoTemp,
    },
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            nome: '',
            documento: '',
            contato: '',
            cep: '',
            antt: '',
            tipoVeiculo: '',
            mei: '',
            foto: '',
            fotoCompleta: '',
            loading: false,
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.carregarDados()
    },
    methods: {
        carregarDados() {
            this.modoEdicao = false;
            this.nome = this.data.nome;

                this.documento = colarCPF(this.data.documento);
        
            this.contato = colarCelular(this.data.contato);
            this.cep = colarCEP(this.data.cep);
                this.foto = this.data.foto;
                this.fotoCompleta = `${this.apiUrl}/public/files/${this.foto}`
                this.antt = this.data.antt;
                this.mei = this.data.mei;
                this.tipoVeiculo = this.data.tipoVeiculo;
        },
        mascaraDocumentoInput(event) {
           
                if (this.documento.length == 14) {
                    this.documento = colarCPF(this.documento, event)
                } else {
                    this.documento = MascaraCPF(this.documento.replace(/\s/g, ''), event);
                }
            

        },
        colarDocumentoInput(event) {
    
                var aux = colarCPF(event.clipboardData.getData('text').replace(/\s/g, ''), event);
                this.documento = aux;

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
    }
}
</script>

<style scoped>
.containerSmall {
    width: 100%;
    border-radius: 15px;
    padding: 5%;
    background-color: #F2F2F2;
    margin: 1rem auto;
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
