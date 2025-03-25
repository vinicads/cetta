<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <planosComponent v-if="!idPlanoAtual" @escolherPlano="changePlano" />
            <compraPlanos v-if="idPlanoAtual" :idPlano="idPlanoAtual" @cancelar="closePopup" @voltar="voltarCompra" />
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
import planosComponent from './components/planosComponent.vue'
import compraPlanos from './components/compraPlanos.vue'
import { verificaCEP, RemoveMascaraCEP } from '@/utils/utils.js';

export default {
    emits: ['close'],
    components: {
        Mensagem,
        popupCarregamentoTemp,
        planosComponent,
        compraPlanos
    },
    props: {
        idPlano: Number,
    },
    data() {
        return {
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            planos: '',
            idPlanoAtual: null,
            loading: false,
        }
    },
    methods: {
        aplicarMascaraValor() {
            let valorNumerico = this.valorFrete.replace(/\D/g, '');
            let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            this.valorFrete = valorFormatado;
        },
        changePlano(data){
            if(this.perfil != 'Empresa'){
                this.$router.push({name: 'login'})
            }
            this.idPlanoAtual = data.idPlanos;
        },
        voltarCompra(){
            this.idPlanoAtual = null;
        },
        aplicarMascaraValorRetorno(valor) {
            let valorNumerico = parseFloat(valor.replace(',', '.').replace(/[^\d.,]/g, ''));
            if (isNaN(valorNumerico)) {
                return "0,00";
            }
            let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            return valorFormatado;
        },
        removerMascaraValor() {
            let valorNumerico = this.valorFrete.replace(/[^\d,]/g, '');
            this.valorFrete = valorNumerico;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '');
            return valorNumerico;
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        formatData(dateString) {
            const date = new Date(dateString);
            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();
            return `${dia}/${mes}/${ano}`;
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
    watch: {
        idPlano: {
            immediate: true,
            handler(newVal) {
                this.idPlanoAtual = newVal || null;
            },
        },
    },
    mounted() {

        if (this.idPlano){
            this.idPlanoAtual = this.idPlano;
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
.checkbox-grid label {
    display: flex !important;
    align-items: center !important;
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
    z-index: 100100;
}

.popup-content {
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 15px;
    max-width: 90%;
    overflow-y: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.close-button {
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
}



.form-group {
    margin-bottom: 2rem !important;
}

.form-group ul {
    list-style-position: inside;
}

.form-group label {
    display: block;
}

.form-group input[type="text"],
.form-group input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-group p {
    margin: 0;
}

.compra {
    display: flex;
    justify-content: space-between;
}

.resumo-container {
    margin-left: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    width: 100%;
    padding: 2%;
    max-width: 300px;
}

.resumo-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.resumo-item span:first-child {
    font-weight: bold;
}

.buttons {
    display: flex;
    justify-content: end;
    margin-top: 20px;
    width: 100%;
}


.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1002;
}

.loading-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-left: 8px solid var(--cor-principal);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}



.buttons button {
    border-radius: 15px;
    color: white;
    padding: 10px;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botaoPrimario {
    border-radius: 15px;
    color: white;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botaoPrimario:hover {
    background-color: var(--cor-branco);
    color: var(--cor-principal);
}

@media(min-width:1300px){
    .popup-content{
        height: auto;
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
        padding: 10px;
    }

    h2 {
        font-size: 1.2rem;
    }

    .compra {
        flex-direction: column;
    }

    .resumo-container {
        margin-top: 20px;
        margin-left: 0;
        max-width: 100% !important;
        width: 100% !important;
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
