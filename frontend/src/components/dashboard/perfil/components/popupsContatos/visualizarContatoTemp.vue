<template>
    <div class="popup-container" @click="closePopupOnOverlay" v-if="showVisualizarContatoPopup">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <section class="veiculos">
                <div class="display popup">
                    <perfilTemp :data="this.data.conta"/>
                </div>
            </section>
            <section class="veiculos">
                <div class="display popup">
                    <veiculosTemp :veiculos="this.data.veiculos"/>
                </div>
            </section>
        </div>
    </div>
</template>
  
  <script>
import store from '@/auth/autenticacao';
import axios from 'axios';
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import veiculosTemp from './templatesVisualizar/veiculosTemp.vue'
import perfilTemp from './templatesVisualizar/perfilTemp.vue'
export default {
    emits: ['close'],
    props: {
        showVisualizarContatoPopup: Boolean,
        data: Object
    },
    components: {
        popupCarregamentoTemp,
        veiculosTemp,
        perfilTemp
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,
        }
    },
    methods: {
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

.display.popup{
    width: 100%;
}

.popup-content {
    z-index: 1001;
    position: relative;
    background: #e6e5e5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: auto;
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
    z-index: 999;
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
        width: 100%;
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

