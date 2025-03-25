<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <desbloquearContatoTemp v-if="showDesbloquearContatoPopup" @close="closeDesbloquearContatoPopup" />
        <visualizarContatoTemp :data="dataEdicao" :showVisualizarContatoPopup="showVisualizarContatoPopup"
            v-if="showVisualizarContatoPopup" @close="closeVisualizarContatoPopup" />
        <div class="title"><span>Contatos Desbloqueados</span>
            <div class="buttonsTitle" v-if="assinatura && assinatura.status == 'Ativo'">
                <button class="excel" @click="exportar"><span>Exportar</span>
                    <img src="../../../../assets/icons/excel.png" alt=""></button>
                <button @click="openDesbloquearContatoPopup"><span>Desbloquear</span>
                    <i class="fa fa-plus" aria-hidden="true"></i></button>
            </div>
            <div class="alerta" v-else><i class="fa fa-exclamation-triangle"></i> <span>Você deve ter uma assinatura
                    ativa para usufruir dos benefícios.</span></div>
        </div>
        <div class="filter-button">
            <button @click="openPopupFiltros">
                Filtrar<i class="fas fa-filter"></i>
            </button>
        </div>
        <PopupFilters :showPopup="showPopupFiltros" @close="closePopupFiltros" :currentFilters="filters"
            @apply-filters="handleFiltersApplied" @clear-filters="handleFiltersCleared" />
        <div class="cards" v-if="!semResultado">

            <div v-for="(item, index) in paginatedItems" :key="index" :class="{ 'card': true, 'loading': loading }">
                <div class="info">
                    <div class="imagem">
                        <img :src="`${apiUrl}/public/files/${item.conta.foto}`"
                            v-if="item.conta.foto && item.conta.foto != 'semFoto'" alt="">
                        <img src="../../../../assets/icons/semFoto.png" v-else alt="">
                    </div>
                    <div class="grid-info">
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Nome</label>
                            <input type="text" class="form-control" :value="item.conta.nome" disabled="true" id="modelo"
                                maxlength="100" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Documento</label>
                            <input type="text" class="form-control" disabled="true"
                                :value="colarCPFInput(item.conta.documento)" id="placa" maxlength="45" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Telefone</label>
                            <input type="text" class="form-control" disabled="true"
                                :value="colarTelefoneInput(item.conta.contato)" id="placa" maxlength="100" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">E-mail</label>
                            <input type="text" class="form-control" disabled="true" :value="item.conta.email" id="placa"
                                maxlength="100" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Tipos de veiculos</label>
                            <input type="text" class="form-control" disabled="true"
                                :value="item.conta.veiculos.length > 0 ? item.conta.veiculos : 'Nenhum'" id="veiculos"
                                required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label>Tipo de veículo</label>
                            <div>
                                <label for="CargaSeca" class="radio-label">
                                    <input type="radio" id="CargaSeca" value="CargaSeca" disabled="true"
                                        v-model="item.conta.tipoVeiculo"> Carga Seca
                                </label>
                            </div>
                            <div>
                                <label for="Refrigerado" class="radio-label">
                                    <input type="radio" id="Refrigerado" value="Refrigerado" disabled="true"
                                        v-model="item.conta.tipoVeiculo"> Refrigerado
                                </label>
                            </div>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label>Possui ANTT</label>
                            <div>
                                <label for="antt_sim" class="radio-label">
                                    <input type="radio" id="antt_sim" value="true" disabled="true"
                                        v-model="item.conta.antt"> Sim
                                </label>
                            </div>
                            <div>
                                <label for="antt_nao" class="radio-label">
                                    <input type="radio" id="antt_nao" value="false" disabled="true"
                                        v-model="item.conta.antt"> Não
                                </label>
                            </div>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label>Possui MEI</label>
                            <div>
                                <label for="mei_sim" class="radio-label">
                                    <input type="radio" id="mei_sim" value="true" disabled="true"
                                        v-model="item.conta.mei"> Sim
                                </label>
                            </div>
                            <div>
                                <label for="mei_nao" class="radio-label">
                                    <input type="radio" id="mei_nao" value="false" disabled="true"
                                        v-model="item.conta.mei"> Não
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="openVisualizarContatoPopup(item)">Visualizar</button>
                </div>
            </div>

        </div>
        <div class="aviso" v-if="semResultado">
            Não há nenhum contato desbloqueado :(
        </div>
        <div class="divNavigation" v-if="!semResultado">
            <div class="pagination">
                <button @click="changePage(1)">Início</button>
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
                <div class="paginationText"> <b>{{ currentPage }}</b> de {{ totalPages }}</div>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Próxima</button>
                <button @click="changePage(totalPages)">Fim</button>
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
import popupCarregamentoTemp from '../../../popups/popupCarregamentoTemp.vue'
import Mensagem from '../../../alertas/mensagensTemp.vue';
import desbloquearContatoTemp from './popupsContatos/desbloquearContatoTemp.vue'
import visualizarContatoTemp from './popupsContatos/visualizarContatoTemp.vue'
import PopupFilters from './popupsContatos/filtrosPopup.vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        desbloquearContatoTemp,
        visualizarContatoTemp,
        PopupFilters
    },
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            assinatura: store.state.assinatura,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            contatos: [],
            semResultado: false,
            loading: false,
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: 0,
            showVisualizarContatoPopup: false,
            showDesbloquearContatoPopup: false,
            showPopupFiltros: false,
            filters: {
                filterValue: '',
                antt: '',
                mei: '',
                selectedTipos: []
            },
            dataVisualizacao: '',
        }
    },
    mounted() {
        this.getContatos();
    },
    computed: {
        paginatedItems() {
            if (!this.contatos || !Array.isArray(this.contatos)) {
                return [];
            }

            return this.contatos;
        },
        totalPages() {
            var aux = Math.ceil(this.totalItems / this.itemsPerPage);
            if (aux == 0) {
                aux = 1;
            }
            return aux;
        },
    },
    methods: {
        async exportar() {
            try {
                const response = await axios.get(`${store.state.apiUrl}/contasDesbloqueadas/exportarParaExcel`, {
                    responseType: 'blob',
                    withCredentials: true,
                });
                if (response.status === 200) {
                    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'arquivo.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }
            } catch (error) {
               this.mensagemErro = "Erro ao exportar."
            }
        },
        colarCPFInput(cpf) {
            return colarCPF(cpf)
        },
        colarTelefoneInput(telefone) {
            return colarCelular(telefone)
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            } else {
                if (page < 1) {
                    this.currentPage = 1;
                }
                if (page > this.totalPages) {
                    this.currentPage = this.totalPages;
                }
            }
            this.getContatos();
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
            this.getContatos()
        },
        handleFiltersCleared() {
            this.filters = {
                filterValue: '',
                antt: '',
                mei: '',
                selectedTipos: []
            };
            this.closePopupFiltros()
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async getContatos() {
            this.semResultado = false;

            let nome = '', mei = '', antt = '', tipo = ''
            if (this.filters) {
                if (this.filters.filterValue) {
                    nome = this.filters.filterValue
                }

                if (this.filters.mei) {
                    mei = this.filters.mei
                }

                if (this.filters.antt) {
                    antt = this.filters.antt
                }

                if (this.filters.selectedTipos) {
                    tipo = this.filters.selectedTipos
                }

            }
            var start = (this.currentPage - 1) * this.itemsPerPage;

            try {
                const response = await axios.get(`${store.state.apiUrl}/contasDesbloqueadas?&start=${start}&quantity=${this.itemsPerPage}&tipo=${tipo}&nome=${nome}&mei=${mei}&antt=${antt}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.contatos = response.data.contasDesbloqueadas;
                    this.totalItems = response.data.count;

                    if (this.totalItems < this.itemsPerPage) {
                        this.exibindo = this.totalItems;
                    } else {
                        this.exibindo = this.itemsPerPage;
                    }
                    this.loading = false;


                }
            } catch (error) {
                this.totalItems = 1;
                if (this.totalItems < this.itemsPerPage) {
                    this.exibindo = this.totalItems;
                } else {
                    this.exibindo = this.itemsPerPage;
                }

                this.semResultado = true;
                this.loading = false;
            }

        },
        openDesbloquearContatoPopup() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showDesbloquearContatoPopup = true;
        },
        closeDesbloquearContatoPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getContatos();
            this.showDesbloquearContatoPopup = false;
        },
        openVisualizarContatoPopup(data) {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.dataEdicao = data;
            this.showVisualizarContatoPopup = true;
        },
        closeVisualizarContatoPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getContatos();
            this.showVisualizarContatoPopup = false;
        },
    }
}
</script>

<style scoped>
.containerSmall {
    width: 95%;
    border-radius: 15px;
    padding: 5%;
    background-color: #F2F2F2;
    margin: 5rem auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 1%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
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

.alerta {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    width: 70%;
    padding: 2%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 15px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.alerta i {
    font-size: 3rem;
}

.alerta span {
    font-size: 1rem;
}

.buttonsTitle {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 40%;
}

.buttonsTitle button {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    padding: 0.5rem 2rem;
    border-radius: 15px;
    border: 1px solid var(--cor-principal);
    transition: 0.5s ease-in-out;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-left: 1%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.excel {
    background-color: rgb(64, 90, 64) !important;
    border: 1px solid rgb(64, 90, 64) !important;
}

.excel:hover {
    background-color: transparent !important;
    color: rgb(64, 90, 64) !important;
}

.buttonsTitle button img {
    width: 25px;
}

.buttonsTitle button span {
    display: none;
}

.title button:hover {
    background-color: transparent;
    color: var(--cor-principal);
}

.cards {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.card {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.aviso {
    text-align: center;
    margin-block: 3%;
    font-size: 18px;
}

.info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 3%;
    justify-items: center;
    align-items: center;
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
    border: 1px solid var(--cor-principal);
    background: var(--cor-principal);
    color: var(--cor-branco);
    padding: 1rem 2rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {
    border: 1px solid var(--cor-principal);
    background: transparent;
    color: var(--cor-principal);
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

@media (max-width: 900px) {
    .buttonsTitle {
        flex-direction: column-reverse;
        width: 30%;
    }

    .buttonsTitle button {
        margin-block: 1%;
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
}

@media (min-width: 1200px) {
    .grid-info {
        grid-template-columns: 1fr 1fr;
    }

    .info {
        grid-template-columns: 35% 50%;
        align-items: center;
        justify-items: center;
    }

    .alerta {
        width: 30%;
    }
}

@media (max-width: 500px) {
    .title {
        flex-direction: column;
    }

    .title span {
        width: 100%;
        text-align: center;
    }

    .buttonsTitle {
        flex-direction: column-reverse;
        width: 80%;
    }

    .buttonsTitle button span {
        display: block;
    }

    .alerta {
        width: 100%;
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
