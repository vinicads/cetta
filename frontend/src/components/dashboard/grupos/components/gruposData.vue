<template>
    <div class="containerData">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">{{ totalItems }} grupos disponíveis </div>
        <div class="info" v-if="!semResultado" style="width: 100%;">
            <div v-for="grupo in grupos" :key="grupo.idGrupo" style="padding: 1rem; border-radius: 8px;"
                class="bg-gradient-to-br from-white to-gray-50 p-8 min-h-[270px] rounded-2xl shadow-lg border border-gray-300 hover:shadow-2xl transform hover:scale-[1.03] transition duration-300">
                <h2 class="text-2xl font-bold text-gray-900" style="font-weight: bold;">{{
                    grupo.planos.tipoFuncionalidade == 'Nutricao' ?
                        'Nutrição' : grupo.planos.tipoFuncionalidade }}</h2>
                <p class="text-lg text-gray-600 mt-2">{{ grupo.planos.tipo }}</p>

                <div class="mt-2 space-y-3">
                    <div v-for="(data, index) in grupo.datas" :key="index"
                        class="flex items-center text-gray-700 bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
                        <i class="fas fa-calendar-alt text-blue-500 mr-3"></i>
                        <span class="font-medium text-md" style="font-weight: 400;">{{ formatarDiaSemana(data.dia) }} -
                            {{ data.hora }}</span>
                    </div>
                    <div class="flex items-center text-gray-700 bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
                        <i class="fas fa-clock text-blue-500 mr-3"></i> 
                        <span class="font-medium text-md" style="font-weight: 400;">Início: {{ formatarData(grupo.dataInicio) }}</span>
                    </div>
                   
                </div>

                <div class="mt-9 flex justify-between items-center"
                    style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 2rem;">
                    <div style="width: 50%; border: transparent;"
                        class="flex items-center text-gray-700 text-lg font-semibold bg-gray-100rounded-lg">
                        <i class="fas fa-user text-blue-500 mr-2"></i>
                        {{ grupo.contasCount }}/{{ grupo.planos.qtdePessoas }}
                    </div>
                    <div class="buttons">
                        <button @click="visualizarGrupo(grupo.idGrupo)">
                            {{ perfil == 'Usuario' || !perfil ? 'Entrar' : 'Abrir' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="aviso" v-if="semResultado">
            Não há nenhum grupo disponível :(
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
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, retornaCidade, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        popupCarregamentoTemp,
    },
    name: 'componentgrupos',
    data() {
        return {
            gruposData: [],
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            grupos: [],
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
                this.getgrupos()
            },
        },
        '$store.state.perfil'(newItem, oldItem) {
            this.perfil = store.state.perfil;
            this.autenticacao = store.state.autenticacao;
        },
    },
    mounted() {
        this.filtersNovo = this.filters;
        this.getgrupos()
    },
    computed: {
        paginatedItems() {
            if (!this.grupos || !Array.isArray(this.grupos)) {
                return [];
            }

            return this.grupos;
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
        formatarDiaSemana(dia) {
            const dias = {
                "Segunda": "Segundas",
                "Terca": "Terças",
                "Quarta": "Quartas",
                "Quinta": "Quintas",
                "Sexta": "Sextas",
                "Sabado": "Sábados",
                "Domingo": "Domingos"
            };
            return dias[dia] || dia;
        },
        async visualizarGrupo(idGrupo) {

            if (!this.perfil) {
                this.$router.push('/login');
                return;
            }

            if (this.perfil == 'Usuario') {
                let data = {
                    "idGrupo": idGrupo
                }
                await axios.post(`${store.state.apiUrl}/grupos/entrar`, data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        this.mensagemSucesso = response.data;
                        this.loading = false;
                        this.$router.push(`/grupos/${idGrupo}`);
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

                        this.loading = false;
                    });
            } else {
                this.$router.push(`/grupos/${idGrupo}`);
            }
        },
        async getgrupos() {
            this.semResultado = false;
            this.grupos = [];
            this.totalItems = 0;
            let tipo = '', tipoFuncionalidade = '', data_inicio = '', dias = '', data_final = ''
            if (this.filtersNovo) {
                if (this.filtersNovo.tipo) {
                    tipo = this.filters.tipo;
                }

                if (this.filtersNovo.tipoFuncionalidade) {
                    tipoFuncionalidade = this.filters.tipoFuncionalidade;
                }

                if (this.filtersNovo.data_inicio) {
                    data_inicio = this.filters.data_inicio
                }

                if (this.filtersNovo.data_final) {
                    data_final = this.filters.data_final
                }

                if (this.filtersNovo.dias) {
                    dias = this.filters.dias
                }

            }


            var start = (this.currentPage - 1) * 1;
            try {
                const response = await axios.get(`${store.state.apiUrl}/public/grupos?&start=${start}&quantity=${this.itemsPerPage}&tipo=${tipo}&tipoFuncionalidade=${tipoFuncionalidade}&data_inicio=${data_inicio}&data_final=${data_final}&dias=${dias}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    this.grupos = response.data.grupos;
                    this.totalItems = response.data.count;
                    this.loading = false;


                }
            } catch (error) {
                this.semResultado = true;
                this.loading = false;
            }

        },

        formatarData(data) {
            if (!data) return "Indefinido";
            const options = { day: "2-digit", month: "short", year: "numeric" };
            return new Date(data).toLocaleDateString("pt-BR", options);
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
            this.getgrupos()
        },
    }
}
</script>

<style scoped>
.containerData {
    width: 95%;
    min-height: 100vh;
    border-radius: 15px;
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding-bottom: 1%;
}

.card {
    position: relative;
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
    width: 90%;
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

.status {
    position: absolute;
    top: 10%;
    right: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
}

.status.ativo {
    background-color: green;
}

.status.cancelado {
    background-color: var(--cor-principal);
}

.status.finalizado {
    background-color: orange;
}

.info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    align-items: center;
    gap: 16px;
    position: relative;
    padding: 16px;
    border-radius: 8px;
    background: #f8f9fa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    position: relative;
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
    padding: 0.5rem 1.5rem;
    transition: 0.5s ease-in-out;
    border: 1px solid var(--cor-principal);
    color: var(--cor-branco);
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {

    color: var(--cor-principal);
    background: transparent;
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

.mini-cards {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 10px;

}

.card {
    border: none;
    border-bottom: 1px solid #00000031;
}

.cardGrupo {
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
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

    .containerData {
        width: 100%;
    }

    .filter-button {
        justify-content: end;
    }

    .mini-cards {
        display: flex;

        flex-wrap: wrap;
    }

    .cardGrupo {
        width: 70px;
    }

    .valor strong {
        font-size: 1.8rem;
    }
}

@media (min-width: 1200px) {
    .grid-info {
        grid-template-columns: 1fr 1fr;
    }

    .cardGrupo {
        width: 100px;
        font-size: 12px;
    }

    .title.small {
        font-size: 1.5rem;

    }

    .valor strong {
        font-size: 2.5rem;
    }

}

@media(max-width: 767px) {
    .grid-info {
        flex-direction: column;
        justify-content: center;
        gap: 0;
        padding: 1%;
    }

    .buttons{
        justify-content: end;
    }

    .mini-cards {
        justify-content: center;
        align-items: center;
    }

    .form-group {
        width: 100%;
    }

    .valor {
        width: 100%;
    }

    .valor div {
        margin: 0;
    }

    .valor strong {
        font-size: 1.4rem;
    }

    .title.small {
        text-align: center;
        justify-content: center;
    }

    .cardGrupo {
        width: 100px;
        font-size: 14px;
    }

    .cards {
        width: 100%;
    }

    .buttons button {
        padding: 0.3rem 1rem;
    }
}

@media(max-width: 600px) {

    .imagem {
        width: 50%;
    }

    .grid-info {
        padding: 0;
        flex-direction: column;
        position: relative;
    }

    .grid-info .form-group {
        width: 100%;
    }

    .title.small {
        font-size: 1rem;
    }


    .mini-cards {
        width: 100%;
        margin: 0 auto;
    }

    .cardGrupo {
        width: 100px;
        font-size: 12px;
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
