<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <cadastroVeiculoTemp :showCadastroVeiculoPopup="showCadastroVeiculoPopup" v-if="showCadastroVeiculoPopup"
            @close="closeCadastroVeiculoPopup" />
        <excluirVeiculoPopup :data="dataExclusao" :showDeleteVeiculoPopup="showDeleteVeiculoPopup"
            v-if="showDeleteVeiculoPopup" @close="closeDeleteVeiculoPopup" />
        <editarVeiculoTemp :data="dataEdicao" :showEditarVeiculoPopup="showEditarVeiculoPopup"
            v-if="showEditarVeiculoPopup" @close="closeEditarVeiculoPopup" />
        <div class="title"><span>Veiculos cadastrados</span><button
                @click="openCadastroVeiculoPopup"><span>Cadastrar</span>
                <i class="fa fa-plus" aria-hidden="true"></i></button></div>
        <div class="filter-button">
            <button @click="openPopupFiltros">
                Filtrar<i class="fas fa-filter"></i>
            </button>
        </div>
        <PopupFilters :showPopup="showPopupFiltros" @close="closePopupFiltros" :currentFilters="filters"
            @apply-filters="handleFiltersApplied" @clear-filters="handleFiltersCleared" />
        <div class="cards" v-if="!semResultado">

            <div v-for="(veiculo, index) in paginatedItems" :key="index" :class="{ 'card': true, 'loading': loading }">
                <div class="info">
                    <div class="imagem">
                        <img :src="`${apiUrl}/public/files/${veiculo.foto}`"
                            v-if="veiculo.foto && veiculo.foto != 'semFoto'" alt="">
                        <img src="../../../../assets/images/car.png" v-else alt="">
                    </div>
                    <div class="grid-info">
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Modelo</label>
                            <input type="text" class="form-control" :value="veiculo.modelo" disabled="true" id="modelo"
                                maxlength="100" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Placa</label>
                            <input type="text" class="form-control" disabled="true" :value="veiculo.placa" id="placa"
                                maxlength="45" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Tipo</label>
                            <select id="tipo" class="form-control" :value="veiculo.tipo" disabled="true" required>
                                <option value="">Selecione o tipo</option>
                                <option value="Fiorino">Fiorino</option>
                                <option value="Van">Van</option>
                                <option value="HR">HR</option>
                                <option value="Iveco">Iveco</option>
                                <option value="Vuc">Vuc</option>
                                <option value="TresQuartos">3/4</option>
                                <option value="Toco">Toco</option>
                                <option value="Truck">Truck</option>
                                <option value="Carreta">Carreta</option>
                            </select>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Ano</label>
                            <input type="number" class="form-control" disabled="true" :value="veiculo.ano" id="ano" q
                                required>
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="openDeleteVeiculoPopup(veiculo)"><i class="fas fa-trash"></i></button>
                    <button @click="openEditarVeiculoPopup(veiculo)"><i class="fas fa-edit"></i></button>
                </div>
            </div>

        </div>
        <div class="aviso" v-if="semResultado">
            Não há nenhum veículo disponível :(
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
import cadastroVeiculoTemp from './popupsVeiculos/cadastroVeiculoTemp.vue'
import editarVeiculoTemp from './popupsVeiculos/editarVeiculosTemp.vue'
import excluirVeiculoPopup from './popupsVeiculos/excluirVeiculoPopup.vue'
import PopupFilters from './popupsVeiculos/filtrosPopup.vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        cadastroVeiculoTemp,
        editarVeiculoTemp,
        excluirVeiculoPopup,
        PopupFilters
    },
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            veiculos: [],
            semResultado: false,
            loading: false,
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: 0,
            showDeleteVeiculoPopup: false,
            showEditarVeiculoPopup: false,
            showCadastroVeiculoPopup: false,
            showPopupFiltros: false,
            filters: {
                filterType: '',
                filterValue: '',
                selectedTipos: []
            },
            dataVisualizacao: '',
            dataExclusao: '',
            dataEdicao: '',
        }
    },
    mounted() {
        this.getVeiculos();
    },
    computed: {
        paginatedItems() {
            if (!this.veiculos || !Array.isArray(this.veiculos)) {
                return [];
            }

            return this.veiculos;
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
            this.getVeiculos();
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
            this.getVeiculos()
        },
        handleFiltersCleared() {
            this.filters = {
                filterType: '',
                filterValue: '',
                selectedTipos: []
            };
            this.closePopupFiltros()
            this.getVeiculos()
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async getVeiculos() {
            this.semResultado = false;

            let placa = '', modelo = '', tipo = ''
            if (this.filters) {
                if (this.filters.filterValue) {
                    if (this.filters.filterType == 'placa') {
                        placa = this.filters.filterValue
                    } else {
                        modelo = this.filters.filterValue
                    }
                }

                if (this.filters.selectedTipos) {
                    tipo = this.filters.selectedTipos
                }

            }
            var start = (this.currentPage - 1) * this.itemsPerPage;

            try {
                const response = await axios.get(`${store.state.apiUrl}/veiculos?&start=${start}&quantity=${this.itemsPerPage}&tipo=${tipo}&placa=${placa}&modelo=${modelo}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.veiculos = response.data.veiculos;
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
        openCadastroVeiculoPopup() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showCadastroVeiculoPopup = true;
        },
        closeCadastroVeiculoPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getVeiculos();
            this.showCadastroVeiculoPopup = false;
        },
        openEditarVeiculoPopup(data) {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.dataEdicao = data;
            this.showEditarVeiculoPopup = true;
        },
        closeEditarVeiculoPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getVeiculos();
            this.showEditarVeiculoPopup = false;
        },
        openDeleteVeiculoPopup(data) {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.dataExclusao = data;
            this.showDeleteVeiculoPopup = true;
        },
        closeDeleteVeiculoPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getVeiculos();
            this.showDeleteVeiculoPopup = false;
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

.cards {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
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
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
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
    grid-template-columns: 1fr 1fr;
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

    .filter-button{
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

}

@media (max-width: 425px) {
    .pagination{
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
