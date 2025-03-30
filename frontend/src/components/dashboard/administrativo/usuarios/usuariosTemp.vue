<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="filter-button">
            <button @click="openPopupFiltros">
                Filtros <i class="fas fa-filter"></i>
            </button>
        </div>
            <div class="itens">
                <PopupFilters :showPopup="showPopupFiltros" @close="closePopupFiltros" :currentFilters="filters"
                    @apply-filters="handleFiltersApplied" @clear-filters="handleFiltersCleared" />
                <usuariosData :filters="filters" />
            </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import popupCarregamentoTemp from '../../../popups/popupCarregamentoTemp.vue'
import Mensagem from '../../../alertas/mensagensTemp.vue';
import usuariosData from './components/usuariosData.vue'
import PopupFilters from './components/filtrosUsuarios.vue';
import { ref } from 'vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, retornaCidade, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        PopupFilters,
        usuariosData
    },
    name: 'usuariosComponent',
    data() {
        return {
            loading: false,
            isMobile: window.innerWidth < 768,
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            semResultado: false,
            showPopupFiltros: false,
            filters: {
                nome: '',
                email: '',
                assinatura: '',
                cpf: '',
                cnpj: '',
                perfil: '',
            },

        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    },
    methods: {

        formatData(dateString) {
            const date = new Date(dateString);
            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();

            return `${dia}/${mes}/${ano}`;
        },
        openPopupFiltros() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showPopupFiltros = true;
        },
        closePopupFiltros() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.showPopupFiltros = false;
        },
        handleFiltersApplied(filters) {
            this.filters = filters;
        },
        handleFiltersCleared() {
            this.filters = {
                nome: '',
                email: '',
                idadeInicio: '',
                idadeFim: '',
                perfil: '',
            };
            this.closePopupFiltros()
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
    }
}
</script>

<style scoped>
.containerSmall {
    width: 95%;
    border-radius: 15px;
    padding: 1%;
    margin: 5rem auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 1%;
    margin-top: 8rem;
}

.title {
    font-size: 2rem;
    color: var(--cor-preto);
    font-weight: bold;
    text-align: left;
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.aviso {
    text-align: center;
    margin-block: 3%;
    font-size: 18px;
}


.buttons {
    display: flex;
    width: 97%;
    align-items: center;
    justify-content: end;
    gap: 15px;
    margin: 1%;
    position: relative;
    bottom: 0;
}

.buttons button {
    border-radius: 15px;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.5s ease-in-out;
    border: none;
    background: none;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button i {
    font-size: 1.5rem;
}

.filter-button {
    display: flex;
    justify-content: center;
    z-index: 10;
    align-items: center;
    justify-content: center;
    margin-bottom: 1%;

}

.filter-button button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.3rem;
    color: var(--cor-preto);
    transition: color 0.3s ease;
}

.filter-button button:hover {
    color: var(--cor-principal);
}

.itens {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 2%;
    width: 100%;
    margin: 0 auto;
}


@media(max-width: 1030px) {
    .buttons div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
}

@media (min-width: 768px) {

    .title {
        text-align: left;
        font-size: 3rem;
    }

    .containerSmall {
        width: 100%;
    }

    .buttons {
        position: absolute;
    }

}


@media(max-width: 767px) {

    .containerSmall {
        padding: 0;
        margin-top: 9rem;
    }

    .itens {
        gap: 0;
        width: 100%;
        justify-content: center;
        flex-direction: column;
    }
}

@media(max-width: 600px) {
    .filter-button {
        top: 1%;
    }
}

@media (max-width: 375px) {
    .title {
        text-align: left;
        font-size: 1.5rem;
    }

}
</style>
