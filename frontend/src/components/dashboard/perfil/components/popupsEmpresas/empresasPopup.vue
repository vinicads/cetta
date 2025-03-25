<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Empresas cadastradas</h2>
            <div class="form-container">
                <div class="form-group">
                    <label for="tipo">Buscar por:</label>
                    <div class="filter">
                        <select id="tipo" class="form-control" v-model="tipoBusca" required>
                        <option class="select-option" value="">Selecione o filtro</option>
                        <option class="select-option" value="nome">Nome</option>
                        <option class="select-option" value="documento">Documento</option>
                    </select>
                    <input type="text" class="form-control" @keyup.enter="getEmpresas" id="modelo" v-model="inputBusca"
                        maxlength="100" required>
                        <div class="buttons">
                            <button @click="getEmpresas">Buscar</button>
                        </div>
                 
                    </div>
                    
                </div>

                <section>
                    <empresasData :empresas="empresas" v-if="showEmpresasData" @idEmpresa="receberIdConta" />
                </section>
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
import empresasData from './empresasData.vue'
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';

export default {
    emits: ['close', 'sendID'],
    components: {
        Mensagem,
        popupCarregamentoTemp,
        empresasData
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            empresas: [],
            showEmpresasData: false,
            idConta: '',
            nomeEmpresa: '',
            tipoBusca: '',
            inputBusca: '',
            loading: false,
        }
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        closePopup() {
            this.$emit('sendID', {
                idConta: this.idConta,
                nome: this.nomeEmpresa,
            });
        },
        receberIdConta(dados){
            this.idConta = dados.idEmpresa
            this.nomeEmpresa = dados.nomeEmpresa
            this.closePopup()
        },
        async getEmpresas() {
            this.semResultado = false;

            let nome = '', documento = ''
            if (this.tipoBusca) {
                if (this.tipoBusca == 'nome') {
                  nome = this.inputBusca;
                }else{
                    documento = this.inputBusca
                }

            }
        
            try {
                const response = await axios.get(`${store.state.apiUrl}/users/empresas?&nome=${nome}&documento=${documento}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.empresas = response.data.empresas;
                    this.loading = false;
                    this.showEmpresasData = true;

                }
            } catch (error) {
                this.showEmpresasData = false;
                this.semResultado = true;
                this.loading = false;
            }

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
        this.getEmpresas();
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
    z-index: 1001;
}

.popup-content {
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 95%;
    max-width: 800px;
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

.filter{
    display: flex;
    width: 100%;
}

.filter select{
    padding-right: 25px;
    width: 25%;
}

.filter input{
    width: 45%;
}

.buttons {
    display: flex;
    justify-content: end;
    width: 30%;
    gap: 1%;
}

.buttons button {
    border-radius: 15px;
    border: none;
    color: white;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button{
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
}

.buttons button:hover{
    background-color: var(--cor-branco);
    color: var(--cor-principal);
}

@media (min-width: 768px) {
    .form-container {
        grid-template-columns: 1fr;
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

    h2{
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

