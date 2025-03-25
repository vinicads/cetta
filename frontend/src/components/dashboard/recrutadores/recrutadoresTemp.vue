<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="filter-button" v-if="isMobile">
            <button @click="openPopupFiltros">
                <i class="fas fa-filter"></i>
            </button>
        </div>
        <div class="display">
        <div class="itens" v-if="isMobile">
            

        
            <PopupFilters :showPopup="showPopupFiltros" @close="closePopupFiltros" :currentFilters="filters"
                @apply-filters="handleFiltersApplied" @clear-filters="handleFiltersCleared" />
            <recrutadoresData :filters="filters" />
        </div>
        <div class="itens" v-else>
            <PopupFilters :showPopup="true" :currentFilters="filters" @apply-filters="handleFiltersApplied"
                @clear-filters="handleFiltersCleared" />
            <recrutadoresData :filters="filters" />
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
import popupCarregamentoTemp from '../../popups/popupCarregamentoTemp.vue'
import Mensagem from '../../alertas/mensagensTemp.vue';
import recrutadoresData from './components/recrutadoresData.vue'
import PopupFilters from './components/recrutadoresFiltro.vue';
import { ref } from 'vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, retornaCidade, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        PopupFilters,
        recrutadoresData
    },
    name: 'perfilComponent',
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
                documento: '',
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
                documento: '',
            };
            this.closePopupFiltros()
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
     
        openCadastroFretesPopup() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showCadastroFretesPopup = true;
        },
        closeCadastroFretesPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getFretes();
            this.showCadastroFretesPopup = false;
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

.title.small {
    font-size: 1.3rem;
    font-weight: 700;
}

.title button {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    padding: 0.5rem 2rem;
    border-radius: 15px;
    border: 1px solid var(--cor-principal);
    transition: 0.5s ease-in-out;
    font-size: 1.3rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.title button span {
    display: none;
}

.title button:hover {
    background-color: transparent;
    color: var(--cor-principal);
}


.aviso {
    text-align: center;
    margin-block: 3%;
    font-size: 18px;
}


.info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.imagem {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5% 0;
    width: 30%;
}

.imagem img {
    width: 50%;
    border-radius: 50%;
    object-fit: cover;
    background-position: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    border: 2px solid var(--cor-preto);
    padding: 2%;
    border-radius: 15px;
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
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    width: 100%;
}

.form-group {
    display: flex;
    flex-direction: column;
    width: 70%;
}

.valor {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 10px;
}

.valor div {
    margin-bottom: 2%;

}

.valor strong {
    font-size: 2.5rem;
    font-weight: bolder;
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

.divNavigation {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    flex-direction: column;
    margin-top: 5%;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination input[type='number'] {
    width: 20%;
    text-align: center;
    margin: 5px;
    border: 1px solid black;
    border-radius: 5px;
}

.pagination button {
    width: auto;
    margin: 0 5px;
    border: none;
    background: none;
    color: rgb(0, 0, 0);
}

.paginationText {
    margin: 0 5px;
    color: black;
}

.pagination button:hover {
    cursor: pointer;
    transform: scale(1.05);
}

.filter-button {
    display: flex;
    justify-content: center;
    z-index: 10;
    align-items: center;
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
}

.mini-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    width: 100%;
    gap: 10px;

}

.cardFrete {
    border-radius: 15px;
    background-color: var(--cor-branco);
    color: var(--cor-preto);
    padding: 10px;
    font-size: 10px;
    position: relative;
    max-width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

select {
    padding: 5px 10px !important;
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

@media(max-width: 1030px) {
    .buttons div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
}

@media (min-width: 768px) {
    .info {
        grid-template-columns: 30% 60%;
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

    .title button {
        padding: 2%;
    }

    .title button span {
        display: inline-block;
        margin-right: 10px;
    }

    .containerSmall {
        width: 100%;
    }

    .buttons {
        position: absolute;
    }

    .filter-button {
        justify-content: end;
    }

    .mini-cards {
        grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    }

    .cardFrete {
        max-width: 70px;
    }

    .valor strong {
        font-size: 1.6rem;
    }
}

@media (min-width: 1200px) {
    .grid-info {
        grid-template-columns: 1fr 1fr;
    }

    .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .cardFrete {
        max-width: 100px;
        font-size: 12px;
    }

    .title.small {
        font-size: 2rem;
    }

}

@media(max-width: 767px) {
    .filter-button{
        justify-content: end;
        position: absolute;
        z-index: 10;
        right: 0;
        top: 2%;
    }
    .containerSmall{
        padding: 0;
        margin-top: 9rem;
    }

    .itens{
        gap: 0;
        width: 100%;
        justify-content: center;
        flex-direction: column;
    }
}

@media(max-width: 600px) {
    .filter-button{
        top: 1%;
    }
}


@media (max-width: 425px) {
    .pagination {
        font-size: 0.8rem;
    }

    .pagination button {
        width: auto;
        margin: 0 5px;
    }

    .paginationText {
        margin: 0 2px;
    }
}

@media (max-width: 375px) {
    .title {
        text-align: left;
        font-size: 1.5rem;
    }

}
</style>
