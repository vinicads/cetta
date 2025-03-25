<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Cadastro de Veículo</h2>
            <div class="form-container">
                <div class="form-group">
                    <label for="modelo">Modelo</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarVeiculo" id="modelo" v-model="modelo"
                        maxlength="100" required>
                </div>
                <div class="form-group">
                    <label for="placa">Placa</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarVeiculo" id="placa" maxlength="10"
                        v-model="placa" required>
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo</label>
                    <select id="tipo" class="form-control" v-model="tipo" required>
                        <option class="select-option" value="">Selecione o tipo</option>
                        <option class="select-option" value="Fiorino">Fiorino</option>
                        <option class="select-option" value="Van">Van</option>
                        <option class="select-option" value="HR">HR</option>
                        <option class="select-option" value="Iveco">Iveco</option>
                        <option class="select-option" value="Vuc">Vuc</option>
                        <option class="select-option" value="TresQuartos">3/4</option>
                        <option class="select-option" value="Toco">Toco</option>
                        <option class="select-option" value="Truck">Truck</option>
                        <option class="select-option" value="Carreta">Carreta</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="ano">Ano</label>
                    <input type="number" class="form-control" id="ano" @keyup.enter="cadastrarVeiculo" v-model="ano"
                        required>
                </div>

            </div>
            <div class="form-group" style="margin-top: 5%;">
                <p class="drag-title">Imagem do Veículo (Opcional)</p>
                <div class="draggable-area" :class="{ 'dragging': isDragging }" @drop.prevent="handleDrop"
                    @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @click="triggerFileInput">
                    <input type="file" id="fileInput" ref="fileInput" @change="handleFileUpload" hidden>
                    <p v-if="!foto">Arraste e solte a imagem aqui ou clique para selecionar um arquivo</p>
                    <img v-else :src="imageUrl" alt="Imagem do Veículo" class="uploaded-image">
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">Cancelar</button>
                <button @click="cadastrarVeiculo">Cadastrar</button>
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

export default {
    emits: ['close'],
    props: {
        showCadastroVeiculoPopup: Boolean
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
            modelo: '',
            placa: '',
            tipo: '',
            ano: '',
            loading: false,
            foto: null,
            isDragging: false
        }
    },
    computed: {
        imageUrl() {
            return this.foto ? URL.createObjectURL(this.foto) : '';
        }
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        cadastrarVeiculo() {
            if (this.ano < 1900 || this.ano > new Date().getFullYear()) {
                this.fecharModal()
                this.mensagemErro = 'Ano inválido. Deve ser maior que 1900 e menor ou igual ao ano atual.';
                return;
            }
            this.loading = true;

            const formData = new FormData();
            let foto

            if (this.foto){
                foto = this.foto
            }else{
                foto = 'semFoto'  
            }

            formData.append('arquivos', foto);
            formData.append('veiculos[foto]', 'semFoto');
            formData.append('veiculos[modelo]', this.modelo);
            formData.append('veiculos[placa]', this.placa);
            formData.append('veiculos[tipo]', this.tipo);
            formData.append('veiculos[ano]', Number(this.ano));
            axios.post(`${store.state.apiUrl}/veiculos`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    this.mensagemSucesso = 'Veículo cadastrado com sucesso!';
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
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.foto = file;
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.foto = file;
            this.isDragging = false;
        },
        handleDragOver() {
            this.isDragging = true;
        },
        handleDragLeave() {
            this.isDragging = false;
        }
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

.drag-title {
    font-weight: bold;
    margin-bottom: 5px;
    text-align: center;
}

.draggable-area {
    margin-top: 2%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    color: #ccc;
    width: 100%;
    box-sizing: border-box;
}

.draggable-area.dragging {
    border-color: var(--cor-principal);
    color: var(--cor-principal);
}

.draggable-area img.uploaded-image {
    max-width: 30%;
    max-height: 20vh;
    object-fit: cover;
}

.draggable-area:hover {
    border-color: var(--cor-principal);
    color: var(--cor-principal);
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

