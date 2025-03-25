<template>
    <div class="containerData">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">Recrutadores </div>
        <div class="cards" v-if="!semResultado">

            <div v-for="(recrutador, index) in recrutadores" :key="index" :class="{ 'card': true, 'loading': loading }">
                <avalicaoComponent :idRecrutador="recrutador.idConta" />
                <div class="info">
                    <div class="imagem">
                        <img :src="`${apiUrl}/public/file/${recrutador.conta.foto}`"
                            v-if="recrutador.conta.foto != 'semFoto'" alt="">
                        <img src="../../../../assets/icons/semFoto.png" v-else alt="">
                    </div>
                    <div class="grid-info">
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Nome</label>
                            <input type="text" class="form-control" disabled="true" id="nome"
                                :value="recrutador.conta.nome" maxlength="45" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Documento</label>
                            <input type="text" class="form-control" disabled="true" id="documento"
                                :value="ColarDocumento(recrutador.conta.documento)" required>
                        </div>

                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">CEP</label>
                            <input type="text" class="form-control" disabled="true" id="cep"
                                :value="ColarCepInput(recrutador.conta.cep)" maxlength="9" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Telefone</label>
                            <input type="text" class="form-control" disabled="true" id="contato"
                                :value="colarContato(recrutador.conta.contato)" maxlength="14" required>
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <router-link :to="`/recrutadores/${recrutador.idConta}`">
                        <button>Visualizar</button>
                    </router-link>
                </div>
            </div>

        </div>
        <div class="aviso" v-if="semResultado">
            Não há nenhum recrutador disponível :(
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
import avalicaoComponent from './avaliacaoComponent.vue'
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, retornaCidade, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        popupCarregamentoTemp,
        avalicaoComponent
    },
    name: 'componentfretes',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            recrutadores: [],
            semResultado: false,
            loading: false,
            filtersNovo: '',
            itemsPerPage: 5,
            totalItems: 0,
            currentPage: 1,
        }
    },
    props: {
        filters: {
            type: Object,
            required: false
        },
    },
    watch: {
        filters: {
            immediate: true,
            handler(newVal) {
                this.filtersNovo = newVal || [];
                this.getRecrutadores()
            },
        },
        '$store.state.perfil'(newItem, oldItem) {
            this.perfil = store.state.perfil;
            this.autenticacao = store.state.autenticacao;
        },
    },
    mounted() {
        this.filtersNovo = this.filters;
        this.getRecrutadores()
    },
    computed: {
        paginatedItems() {
            if (!this.recrutadores || !Array.isArray(this.recrutadores)) {
                return [];
            }

            return this.recrutadores;
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
        colarContato(contato) {

            let retorno = colarCelular(contato)
            return retorno
        },
        ColarDocumento(documento) {
            let retorno = colarCPF(documento)
            return retorno
        },
        ColarCepInput(cep) {
            let retorno = colarCEP(cep)
            return retorno
        },
        async getRecrutadores() {
            this.semResultado = false;

            let nome = '', documento = ''
            if (this.filtersNovo) {
                if (this.filtersNovo.nome) {
                    nome = this.filters.nome;
                }

                if (this.filtersNovo.documento) {
                    documento = RemoveMascaraCPF(this.filters.documento);
                }
            }


            var start = (this.currentPage - 1) * 1;
            try {
                const response = await axios.get(`${store.state.apiUrl}/users/recrutadores?&start=${start}&quantity=${this.itemsPerPage}&nome=${nome}&documento=${documento}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.totalItems = response.data.count;
                    this.recrutadores = response.data.recrutadores
                    this.loading = false;


                }
            } catch (error) {
                this.semResultado = true;
                this.loading = false;
            }

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
            this.getRecrutadores()
        },
    }
}
</script>

<style scoped>
.containerData {
    width: 95%;
    border-radius: 15px;
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding-bottom: 1%;
}

.title {
    font-size: 2rem;
    color: var(--cor-preto);
    font-weight: bold;
    text-align: left;
    margin-bottom: 1rem;
    width: 80%;
}

.info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: center;
    align-items: start;
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
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
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

.cards {
    width: 100%;
}

.card {
    padding: 2%;
}

.fa-edit {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 2rem;
    cursor: pointer;
    color: var(--cor-preto);

}


.buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: end;
    gap: 15px;
}

.buttons button {
    border-radius: 15px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--cor-branco);
    background-color: var(--cor-principal);
    border: 1px soiid var(--cor-principal) !important;
    padding: 1rem 2rem;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {
    background-color: transparent;
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

.divNavigation {
    margin: 0 auto;
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


@media (min-width: 768px) {
    .info {
        grid-template-columns: 30% 70%;
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

    .containerSmall {
        width: 100%;
    }
}

@media (min-width: 1200px) {
    .grid-info {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .info {
        grid-template-columns: 30% 60%;
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
</style>
