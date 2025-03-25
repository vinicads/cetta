<template>
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title"><span>Veiculos</span></div>
        <div class="cards" v-if="!semResultado">

            <div v-for="(veiculo, index) in paginatedItems" :key="index" :class="{ 'card': true, 'loading': loading }">
                <div class="info">
                    <div class="imagem">
                        <img :src="`${apiUrl}/public/files/${veiculo.foto}`"
                            v-if="veiculo.foto && veiculo.foto != 'semFoto'" alt="">
                        <img src="../../../../../../assets/images/car.png" v-else alt="">
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
import popupCarregamentoTemp from '../../../../../popups/popupCarregamentoTemp.vue'
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        popupCarregamentoTemp,
    },
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            semResultado: false,
            loading: false,
            itemsPerPage: 5,
            currentPage: 1,
        }
    },
    props: {
        veiculos: {
            type: Array,
            required: true
        }
    },
    computed: {
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.veiculos.slice(startIndex, endIndex);
        },
        totalItems() {
            if (this.veiculos.length == 0){
                this.semResultado = true;
            }
            return this.veiculos.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
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
        },
    }
}
</script>

<style scoped>
.containerSmall {
    width: 100%;
    border-radius: 15px;
    padding: 5%;
    background-color: #F2F2F2;
    margin: 1rem auto;
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
