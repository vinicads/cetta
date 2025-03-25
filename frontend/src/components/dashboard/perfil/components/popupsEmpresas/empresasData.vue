<template>
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />

        <div class="cards" v-if="!semResultado">

            <div v-for="(empresa, index) in paginatedItems" :key="index" :class="{ 'card': true, 'loading': loading }">
                <div class="info">
                    <div class="imagem">
                        <img :src="`${apiUrl}/public/files/${empresa.foto}`"
                            v-if="empresa.foto && empresa.foto != 'semFoto'" alt="">
                        <img src="../../../../../assets/icons/semFoto.png" v-else alt="">
                    </div>
                    <div class="grid-info">
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">Nome</label>
                            <input type="text" class="form-control" :value="empresa.conta.nome" disabled="true" id="nome"
                                maxlength="45" required>
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label for="inputAddress">CNPJ</label>
                            <input type="text" class="form-control" disabled="true" :value="colarCNPJInput(empresa.conta.documento)" id="cnpj"
                                maxlength="18" required>
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <button @click="enviarID(empresa)">Escolher</button>
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
import popupCarregamentoTemp from '../../../../popups/popupCarregamentoTemp.vue'
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        popupCarregamentoTemp,
    },
    name: 'componentEmpresas',
    data() {
        return {
            empresasData: [],
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            semResultado: false,
            loading: false,
            itemsPerPage: 5,
            currentPage: 1,
        }
    },
    props: {
        empresas: {
            type: Object,
            required: false
        }
    },
    watch: {
        empresas: {
            immediate: true,
            handler(newVal) {
                this.empresasData = newVal || [];
                this.semResultado = this.empresasData.length === 0;
            },
        },
    },
    mounted (){
        this.empresasData = this.empresas;
    },
    computed: {
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.empresasData.slice(startIndex, endIndex);
        },
        totalItems() {
            if (this.empresasData.length == 0){
                this.semResultado = true;
            }
            return this.empresasData.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
    },
    methods: {
        colarCNPJInput(cnpj){
           
                cnpj = colarCNPJ(cnpj, event)

            return cnpj;
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
        },
        enviarID(item){
            this.$emit('idEmpresa', {
                idEmpresa: item.conta.idConta,
                nomeEmpresa: item.conta.nome
            });
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
    border: none;
    color: white;
    padding: 10px;
    width: 20%;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    
}

.buttons button:hover{
    background-color: var(--cor-branco);
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
        grid-template-columns: 50% 40%;
    }

    .grid-info {
        grid-template-columns: 1fr;
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
        grid-template-columns: 1fr;
    }

    .info {
        grid-template-columns: 50% 40%;
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
