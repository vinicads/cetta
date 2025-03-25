<template>
    <empresasPopuo v-if="showEmpresasPopup" @sendID="receberIdConta" />
    <comprarFreteTemp v-if="showComprarFretePopup" @close="closeComprarFretePopup" />
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Cadastro de frete</h2>
            <div class="form-container">
                <div class="form-group">
                    <label for="de">Origem</label>
                    <input type="text" @input="mascaraDEInput" @paste="colarDEInput" class="form-control"
                        @keyup.enter="cadastrarFrete" id="de" v-model="de" maxlength="9" required>
                </div>
                <div class="form-group">
                    <label for="valor">Valor</label>
                    <input type="text" class="form-control" @focus="removerMascaraValor" @blur="aplicarMascaraValor"
                        @keyup.enter="cadastrarFrete" id="valor" v-model="valor" required>
                </div>
                <div class="form-group" style="position: relative;">
                    <label for="distancia" style="display: flex;">Distância (em KM)
                        <div class="loadingSmall" v-if="carregandoDistancia">
                            <div class="loading-screen">
                                <div class="spinner"></div>
                            </div>
                        </div>
                    </label>
                    <input type="text" class="form-control" disabled="true" @keyup.enter="cadastrarFrete" id="distancia"
                        v-model="distancia" required>
                </div>
                <div class="form-group" v-if="perfil == 'Recrutador'">
                    <label for="valor">Empresa selecionada: {{ this.nomeEmpresa ? this.nomeEmpresa : 'Nenhuma'
                        }}</label>
                    <button @click="openEmpresasPopup" class="botao">Selecionar</button>
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo de veiculo</label>
                    <select id="tipo" class="form-control" v-model="tipoVeiculo" required>
                        <option class="select-option" value="CargaSeca">Carga Seca</option>
                        <option class="select-option" value="Refrigerado">Refrigerado</option>
                    </select>
                </div>

            </div>
            <div class="form-group" style="margin-top: 4%;">
                <label for="dataInserida">Datas: </label>
                <div class="inputData">
                    <input type="date" class="form-control" id="dataInserida" v-model="dataInserida" required>
                    <button @click="inserirData"><i class="fa fa-plus" aria-hidden="true"></i></button>
                </div>
                <div class="mini-card">
                    <div v-for="(data, index) in datas" :key="index" class="data">
                        {{ data }}
                        <button @click="removerData(index)">X</button>
                    </div>
                </div>
            </div>
            <div class="form-group" style="margin-top: 4%;">
                <label for="dataInserida">Destino: </label>
                <div class="inputData">
                    <input type="text" class="form-control" @input="mascaraParaInput" @paste="colarParaInput" id="para"
                        maxlength="9" v-model="paraInserido" required>
                    <button @click="inserirPara"><i class="fa fa-plus" aria-hidden="true"></i></button>
                </div>
                <div class="mini-card">
                    <div v-for="(item, index) in para" :key="index" class="data">
                        {{ item }}
                        <button @click="removerPara(index)">X</button>
                    </div>
                </div>
            </div>
            <div class="form-group" style="margin-top: 4%;">
                <label>Tipos de veiculo:</label>
                <div class="checkbox-grid">
                    <label v-for="tipo in tipos" :key="tipo" class="checkbox-label">
                        <input type="checkbox" :value="tipo" v-model="selectedTipos" /> {{ tipo == 'TresQuartos' ? '3/4'
                            : tipo }}
                    </label>
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">Cancelar</button>
                <button @click="cadastrarFrete">Cadastrar</button>
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
import empresasPopuo from '../popupsEmpresas/empresasPopup.vue'
import comprarFreteTemp from './comprarFreteTemp.vue'
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    emits: ['close'],
    props: {
        showCadastroFretesPopup: Boolean
    },
    components: {
        Mensagem,
        popupCarregamentoTemp,
        empresasPopuo,
        comprarFreteTemp
    },
    data() {
        return {
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            datas: [],
            dataInserida: '',
            tipoVeiculo: "CargaSeca",
            de: '',
            para: [],
            paraInserido: '',
            distancia: '',
            valor: '',
            selectedTipos: [],
            empresas: [],
            carregandoDistancia: false,
            loading: false,
            idEmpresa: '',
            nomeEmpresa: '',
            showEmpresasPopup: false,
            showComprarFretePopup: false,
            tipos: ['Fiorino', 'Van', 'HR', 'Iveco', 'Vuc', 'TresQuartos', 'Toco', 'Truck', 'Carreta']
        }
    },
    methods: {
        receberIdConta(dados) {
            this.idEmpresa = dados.idConta;
            this.nomeEmpresa = dados.nome;
            this.showEmpresasPopup = false;
            document.addEventListener('keydown', this.onEscKey);
        },
        openEmpresasPopup() {
            document.removeEventListener('keydown', this.onEscKey);
            this.showEmpresasPopup = true;
        },
        async verificarCEP(cep) {
            let cepSemMascara = await RemoveMascaraCEP(cep)
            let verifica = await verificaCEP(cepSemMascara)
            if (verifica) {
                return true;
            }
            return false;
        },
        async calcularDistancia() {

            if (!this.de || this.para.length == 0){
                this.mensagemErro = "Origem e Destino devem ser preenchidos.";
                return;
            }
            let deSemMascara = await RemoveMascaraCEP(this.de);
            let distanciaTotal = 0;

            if (this.para.length > 0) {
                let paraSemMascara = await RemoveMascaraCEP(this.para[0]);

                let data = {
                    "de": deSemMascara,
                    "para": paraSemMascara,
                };

                try {
                    let response = await axios.post(`${store.state.apiUrl}/public/calcularDistancia`, data, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    distanciaTotal += parseFloat(response.data.distancia);
                } catch (error) {
                    this.fecharModal();
                    if (error.response && error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }
                    this.carregandoDistancia = false;
                    return;
                }

                for (let i = 0; i < this.para.length - 1; i++) {
                    let deCEP = await RemoveMascaraCEP(this.para[i]);
                    let paraCEP = await RemoveMascaraCEP(this.para[i + 1]);

                    let data = {
                        "de": deCEP,
                        "para": paraCEP,
                    };

                    try {
                        let response = await axios.post(`${store.state.apiUrl}/public/calcularDistancia`, data, {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        distanciaTotal += parseFloat(response.data.distancia);
                    } catch (error) {
                        this.fecharModal();
                        if (error.response && error.response.data) {
                            if (error.response.data.message) {
                                this.mensagemErro = error.response.data.message[0];
                            } else {
                                this.mensagemErro = error.response.data;
                            }
                        }
                        this.carregandoDistancia = false;
                        return;
                    }
                }
            }
            this.distancia = distanciaTotal.toFixed(1);
            this.carregandoDistancia = false;
        },
        aplicarMascaraValor() {
            let valorNumerico = this.valor.replace(/\D/g, '');

            let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            this.valor = valorFormatado;
        },
        removerMascaraValor() {
            let valorNumerico = this.valor.replace(/[^\d,]/g, '');

            this.valor = valorNumerico;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '');

            return valorNumerico;
        },
        mascaraDEInput(event) {
            if (this.de.length == 9) {
                this.de = colarCEP(this.de, event)
            } else {
                this.de = MascaraCEP(this.de.replace(/\s/g, ''), event);
            }
        },
        colarDEInput(event) {
            var aux = colarCEP(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.de = aux;
        },
        mascaraParaInput(event) {
            if (this.paraInserido.length == 9) {
                this.paraInserido = colarCEP(this.paraInserido, event)
            } else {
                this.paraInserido = MascaraCEP(this.paraInserido.replace(/\s/g, ''), event);
            }
        },
        colarParaInput(event) {
            var aux = colarCEP(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.paraInserido = aux;
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async inserirPara() {
            if (this.paraInserido) {
                if (this.para.includes(this.paraInserido)) {
                    this.paraInserido = '';
                    return;
                }
                let verificaPara = await this.verificarCEP(this.paraInserido)
                if (!verificaPara) {
                    this.fecharModal()
                    this.mensagemErro = "O CEP de destino inserido é inválido."
                    return;
                }
                this.para.push(this.paraInserido);
                this.paraInserido = '';
            }
        },
        removerPara(index) {
            this.para.splice(index, 1);
        },
        inserirData() {
            if (this.dataInserida) {
                if (this.perfil == 'Empresa') {
                    if (this.datas.length >= 1) {
                        this.fecharModal()
                        this.mensagemErro = "Empresas só podem adicionar uma data por frete. Procure por um recrutador.";
                        return;
                    }
                }
                if (this.datas.includes(this.formatData(this.dataInserida))) {
                    this.dataInserida = '';
                    return;
                }
                this.datas.push(this.formatData(this.dataInserida));
                this.dataInserida = '';
            }
        },
        removerData(index) {
            this.datas.splice(index, 1);
        },
        formatData(dateString) {
            const date = new Date(dateString);

            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();

            return `${dia}/${mes}/${ano}`;
        },
        openComprarFretePopup() {
            document.removeEventListener('keydown', this.onEscKey);
            this.showComprarFretePopup = true;
        },
        closeComprarFretePopup() {
            document.addEventListener('keydown', this.onEscKey);
            this.showComprarFretePopup = false;
        },
        async cadastrarFrete() {

            this.loading = true;
            if (this.de && this.para) {
                let verificaDe = await this.verificarCEP(this.de)
                if (!verificaDe) {
                    this.fecharModal()
                    this.mensagemErro = "O CEP de origem inserido é inválido."
                    return;
                }
                await this.calcularDistancia()
            } else {
                this.fecharModal();
                this.mensagemErro = "Origem e destino devem ser preenchidos.";
                this.loading = false;
                return;
            }

            let de, para, valor

            if (this.de) {
                de = await RemoveMascaraCEP(this.de)
            }

            if (this.valor) {
                valor = Number(this.removerMascaraValorRetorno(this.valor).replace(',', '.'))
            }

            let idRecrutador, idEmpresa
            if (this.perfil == 'Recrutador') {
                idRecrutador = this.autenticacao.idConta;
            }

            if (this.idEmpresa) {
                idEmpresa = this.idEmpresa
            }

            let paraSemMascara = await Promise.all(this.para.map(async cep => await RemoveMascaraCEP(cep)));

            const data = {
                "fretes": {
                    "de": de,
                    "para": paraSemMascara,
                    "valor": valor,
                    "distancia": Number(this.distancia),
                    "tipoVeiculo": this.tipoVeiculo,
                    "datas": this.datas,
                    "tiposVeiculos": this.selectedTipos,
                    "idRecrutador": idRecrutador,
                    "idEmpresa": idEmpresa
                }
            }

            await axios.post(`${store.state.apiUrl}/fretes`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.mensagemSucesso = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal()
                    if (error.response.status == 405) {
                        this.openComprarFretePopup()
                        this.loading = false;
                        return;
                    }
                    if (error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }

                    this.loading = false;
                });
        },
        async getEmpresas() {
            this.loading = true;
            await axios.get(`${store.state.apiUrl}/users/empresas`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.empresas = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal()
                    if (error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }

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
        if (this.perfil == 'Recrutador') {
            this.getEmpresas();
        }
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
.checkbox-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
    gap: 20px;
}

.checkbox-grid label {
    display: flex;
    align-items: center;
    width: 100%;
}

.checkbox-grid input[type="checkbox"] {
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

.checkbox-grid input[type="checkbox"]:checked::after {
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

.loadingSmall .loading-screen {
    margin-left: 0.5rem;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
}

.loadingSmall .spinner {
    border: 4px solid var(--cor-preto);
    border-top: 4px solid var(--cor-principal);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 2s linear infinite;
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

.botao {
    border-radius: 15px;
    border: none;
    color: white;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botao:hover {
    background-color: var(--cor-branco);
    color: var(--cor-principal);
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

.inputData {
    display: flex;
    align-items: center;
    justify-content: start;
}

.inputData input {
    width: 50%;
    height: 2rem;
}

.inputData button {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    border: 1px solid var(--cor-principal);
    border-radius: 15px;
    display: flex;
    align-items: center;
    height: 2rem;
    font-size: 1.3rem;
    padding: 0 2rem;
    transition: 0.3s ease-in-out;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.inputData button:hover {
    background-color: transparent;
    color: var(--cor-principal);
}

.mini-card {
    margin-top: 5%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
}

.data {
    border-radius: 15px;
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    padding: 10px;
    position: relative;
    max-width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.data button {
    position: absolute;
    top: 2px;
    right: 5px;
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--cor-branco);
    cursor: pointer;
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

    .mini-card {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .data {
        max-width: 150px;
    }
}

@media (max-width: 360px) {
    .mini-card {
        grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
    }

    .data {
        max-width: 100%;
    }
}
</style>
