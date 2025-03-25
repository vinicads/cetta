<template>
        <planosPopup v-if="showPlanosPopup" @close="closePopupPlanos" />
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Desbloqueio de contatos</h2>
            <div style="text-align: center;">Aqui você pode filtrar os contatos que deseja desbloquear.</div>
            <div class="form-container">
                <div class="form-group" style="text-align: left;">
                    <label>Motorista possui MEI</label>
                    <div>
                        <label for="mei_sim" class="radio-label">
                            <input type="radio" id="mei_sim" value="true" v-model="mei"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="mei_nao" class="radio-label">
                            <input type="radio" id="mei_nao" value="false" v-model="mei"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label>Motorista possui ANTT</label>
                    <div>
                        <label for="antt_sim" class="radio-label">
                            <input type="radio" id="antt_sim" value="true" v-model="antt"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="antt_nao" class="radio-label">
                            <input type="radio" id="antt_nao" value="false" v-model="antt"> Não
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
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
                <button @click="desbloquearContatos">Desbloquear</button>
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
import planosPopup from '../../../planos/planosTemp.vue'
export default {
    emits: ['close'],
    props: {
        showCadastroVeiculoPopup: Boolean
    },
    components: {
        Mensagem,
        planosPopup,
        popupCarregamentoTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            tipos: ['Fiorino', 'Van', 'HR', 'Iveco', 'Vuc', 'TresQuartos', 'Toco', 'Truck', 'Carreta'],
            antt: '',
            mei: '',
            showPlanosPopup: false,
            loading: false,
            selectedTipos: [],
        }
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        openPopupPlanos(){
            document.removeEventListener('keydown', this.onEscKey);
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showPlanosPopup = true;
        },
        closePopupPlanos(){
            document.addEventListener('keydown', this.onEscKey);
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.showPlanosPopup = false;
        },
        async desbloquearContatos() {
            this.loading = true;
            if (this.selectedTipos) {
                if ((this.selectedTipos.length < 4) && (this.selectedTipos.length >= 1)) {
                    this.fecharModal()
                    this.mensagemErro = "Ao selecionar um tipo de veículo, você precisa selecionar no mínimo 4."
                    this.loading = false;
                    return;
                }
            }
            const data = {
                "contasDesbloqueadas": {
                    "mei": this.mei ? this.mei : undefined,
                    "antt": this.antt ? this.antt : undefined,
                    "tipo": this.selectedTipos ? this.selectedTipos : null
                }
            }
            await axios.post(`${store.state.apiUrl}/contasDesbloqueadas/desbloquearContas`, data, {
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
                    if(error.response.status == 401){
                        this.openPopupPlanos();
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
    margin-bottom: 20px;
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
    width: 25%;
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


.checkbox-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
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

    .checkbox-grid {
        grid-template-columns: repeat(auto-fit, minmax(15%, 1fr));
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
