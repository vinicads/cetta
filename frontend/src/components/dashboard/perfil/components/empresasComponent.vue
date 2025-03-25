<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title"><span>Desconto para Empresas</span> </div>
        <div class="valor"><div>Insira o desconto</div><input type="text" v-model="valor" @focus="removerMascaraValor" @blur="aplicarMascaraValor"></div>
        <div class="filter-button">
            <button @click="openPopupFiltros">
                Filtrar<i class="fas fa-filter"></i>
            </button>
        </div>
        <PopupFilters :showPopup="showPopupFiltros" @close="closePopupFiltros" :currentFilters="filters"
            @apply-filters="handleFiltersApplied" @clear-filters="handleFiltersCleared" />
        <div class="cards" v-if="!semResultado">

            <div v-for="(empresa, index) in paginatedItems" :key="index" :class="{ 'card': true, 'loading': loading }">
         
                    <div class="info">
                        <div class="imagem">
                            <img :src="`${apiUrl}/public/files/${empresa.foto}`"
                                v-if="empresa.foto && empresa.foto != 'semFoto'" alt="">
                            <img src="../../../../assets/icons/semFoto.png" v-else alt="">
                        </div>
                        <div class="grid-info">
                            <div class="form-group" style="text-align: left;">
                                <label for="inputAddress">Nome</label>
                                <input type="text" class="form-control" :value="empresa.conta.nome" disabled="true"
                                    id="nome" maxlength="45" required>
                            </div>
                            <div class="form-group" style="text-align: left;">
                                <label for="inputAddress">CNPJ</label>
                                <input type="text" class="form-control" disabled="true"
                                    :value="colarCNPJInput(empresa.conta.documento)" id="cnpj" maxlength="18" required>
                            </div>
                        </div>
                </div>
                <div class="buttons">
                   
                    <button @click="aplicarDesconto(empresa.conta.idConta)">Aplicar Desconto</button>
                </div>
            </div>

        </div>
        <div class="aviso" v-if="semResultado">
            Não há nenhuma empresa disponível :(
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
import PopupFilters from './popupsDesconto/filtrosPopup.vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
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
            empresas: [],
            valor: '',
            semResultado: false,
            loading: false,
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: 0,
            showPopupFiltros: false,
            filters: {
                nome: '',
                documento: '',
            },
        }
    },
    mounted() {
        this.getEmpresas();
    },
    computed: {
        paginatedItems() {
            if (!this.empresas || !Array.isArray(this.empresas)) {
                return [];
            }

            return this.empresas;
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
        aplicarMascaraValor() {
            let valorNumerico = this.valor.replace(/\D/g, '');

            let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            this.valor = valorFormatado;
        },
        removerMascaraValor() {
            let valorNumerico = this.valor.replace(/[^\d,]/g, '');

            this.valor = valorNumerico;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '');

            return valorNumerico;
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
            this.getEmpresas();
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
            this.getEmpresas()
        },
        handleFiltersCleared() {
            this.filters = {
                nome: '',
                documento: '',
            };
            this.closePopupFiltros()
            this.getEmpresas()
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        colarCNPJInput(cnpj) {

            cnpj = colarCNPJ(cnpj, event)

            return cnpj;
        },
        async aplicarDesconto(idEmpresa){
            if (!this.valor){
                this.mensagemErro = "Valor do desconto deve ser preenchido.";
                return;
            }
            let valor = this.removerMascaraValorRetorno(this.valor).replace(',', '.')
            valor = Number(valor)
            const data = {
               "desconto": {
                "idEmpresa": idEmpresa,
                "valor": valor,
               }
            }
            await axios.post(`${store.state.apiUrl}/desconto`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.valor = ''
                    this.mensagemSucesso = response.data;
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

                });
        },
        async getEmpresas() {
            this.semResultado = false;

            let nome = '', documento = ''
            if (this.filters) {
                if (this.filters.nome) {
                    nome = this.filters.nome;
                }

                if (this.filters.documento) {
                    documento = RemoveMascaraCNPJ(this.filters.documento)
                }

            }
            var start = (this.currentPage - 1) * this.itemsPerPage;

            try {
                const response = await axios.get(`${store.state.apiUrl}/users/empresas?&start=${start}&quantity=${this.itemsPerPage}&nome=${nome}&documento=${documento}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.empresas = response.data.empresas;
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


.valor input{
    padding: 0.5% 1%;
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
    color: var(--cor-branco);
    padding: 1rem 2rem;
    border: 1px solid var(--cor-principal);
    background: var(--cor-principal);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover{
    background-color: transparent;
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
