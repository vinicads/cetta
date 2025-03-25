<template>
      <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="popup-container" v-if="showEnviarEmailGeralPopup" @click="closePopupOnOverlay">
        <div class="popup-content">
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Enviar e-mails</h2>
            <div class="form-group">
                    <label for="filterType">Conteúdo:</label>
                    <div class="input-group">
                       <textarea name="" style="width: 100%; height: 5rem;" v-model="conteudo" id=""></textarea>
                    </div>
                </div>
            <div class="form-container">
                
                <div class="form-group">
                    <label>Assinatura</label>
                    <div>
                        <label for="Ativo" class="radio-label">
                            <input type="radio" id="Ativo" value="Ativo" v-model="assinatura"> Ativo
                        </label>
                    </div>
                    <div>
                        <label for="Inativo" class="radio-label">
                            <input type="radio" id="Inativo" value="Inativo" v-model="assinatura"> Inativo
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Tipos:</label>
                    <div class="checkbox-group">
                        <label v-for="tipo in tipos" :key="tipo">
                            <input type="checkbox" :value="tipo" v-model="selectedPerfis" /> {{ tipo }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <button @click="enviarEmail">Enviar</button>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/auth/autenticacao';
import axios from 'axios';
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
export default {
    props: {
        showEnviarEmailGeralPopup: Boolean,
    },
    emits: ['close'],
    components: {
        Mensagem,
        popupCarregamentoTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            assinatura: '',
            conteudo: '',
            selectedPerfis:[],
            tipos: ['Admin', 'Motorista', 'Empresa']
        };
    },
    mounted() {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
    },
    methods: {
        onEscKey(event) {
            if (event.key === 'Escape') {
                this.closePopup();
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        closePopup() {
            this.$emit('close');
        },
        closePopupOnOverlay(event) {
            if (event.target === event.currentTarget) {
                this.closePopup();
            }
        },
        async enviarEmail() {
            this.loading = true;
            this.mensagemAlerta = '';
            this.mensagemErro = '';
            this.mensagemSucesso = '';
            const data = {
                "assinatura": this.assinatura,
                "conteudo": this.conteudo,
                "perfil": this.selectedPerfis
            }

            await axios.post(`${store.state.apiUrl}/users/enviarEmailGeral`,
                data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.mensagemSucesso = response.data
                })
                .catch((error) => {
                    if(error.response.data){
            if (error.response.data.message) {
            this.mensagemErro = error.response.data.message;
          } else {
            this.mensagemErro = error.response.data;
          }
          }else{
            this.mensagemErro = "Algo deu errado.";
          }
         
          this.loading = false;
                });
        },
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

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.input-group {
    display: flex;
    gap: 10px;
}

.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: var(--cor-principal);
    outline: none;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    width: 100%;
}

.checkbox-group input[type="checkbox"] {
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

.checkbox-group input[type="checkbox"]:checked::after {
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

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.buttons button {
    border-radius: 5px;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:first-of-type {
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
    color: white;
}

.buttons button:first-of-type:hover {
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

.buttons button:last-of-type {
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    color: white;
}

.buttons button:last-of-type:hover {
    background-color: transparent;
    color: var(--cor-principal);
}

select {
    padding: 5px !important;
    border: 2px solid var(--cor-principal);
    border-radius: 5px;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--cor-branco);
    color: var(--cor-preto);
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
}

select:hover,
select:focus {
    border-color: var(--cor-principal);
    outline: none;
}

select option {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

select option:hover {
    background-color: var(--cor-principal) !important;
    color: white;
}

@media (min-width: 768px) {
    .form-container {
        grid-template-columns: 1fr 1fr;
    }

    .checkbox-group label {
        width: 45%;
    }
}

@media (max-width: 767px) {
    .form-container {
        grid-template-columns: 1fr;
    }

    .checkbox-group label {
        width: 100%;
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