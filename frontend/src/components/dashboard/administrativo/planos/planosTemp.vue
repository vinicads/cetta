<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <cadastroPlanosPopup :showCadastroPlanosPopup="showCadastroPlanosPopup"
        v-if="showCadastroPlanosPopup" @close="closeCadastroPlanosPopup" />
    <editarPlanosPopup :data="dataEdicao" :showEditarPlanosPopup="showEditarPlanosPopup"
        v-if="showEditarPlanosPopup" @close="closeEditarPlanosPopup" />
    <deletarPlanosPopup :data="dataExclusao" :showDeletePlanosPopup="showDeletePlanosPopup"
        v-if="showDeletePlanosPopup" @close="closeDeletePlanosPopup" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />

        <div class="display">
            <div class="conteudoExibido">
                <div class="title">Planos</div>
          <div class="table-container">
            <div class="headerTable">
              <div class="cadastro"><button type="button" class="botaoPrimario"
                  @click="openCadastroPlanosPopup">Novo <i class="fa fa-plus"
                    aria-hidden="true"></i></button>
              </div>

              <div class="itemsSelector">
                <div>Itens por página:</div>
                <select id="itemsPerPage" v-model="itemsPerPage" @change="changeItemsPerPage">
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th scope="col" class="acoes">Nome</th>
                  <th scope="col" class="acoes">Contatos</th>
                  <th scope="col" class="acoes">Fretes</th>
                  <th scope="col" class="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in paginatedItems" :key="index">
                  <td data-label="Nome">{{ item.nome }}</td>
                  <td data-label="Contatos">{{ item.qtdeContatos }}</td>
                  <td data-label="Fretes">{{ item.qtdeFrete }}</td>
                  <td data-label="Ações">
                    <button type="button" title="Editar" class="btn" @click="openEditarPlanosPopup(item)">
                      <img src="@/assets/icons/editar.png" alt="Visualizar" class="btnEditar">
                    </button>
                    <button type="button" title="Deletar" class="btn" @click="openDeletePlanosPopup(item)"><img
                        src="@/assets/icons/delete.png" alt="Excluir" class="btnEditar"></button>
                  </td>
                </tr>
                <tr v-if="semResultado">
                  <td colspan="4">Nenhum registro encontrado.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="headerTable">
            <div class="pagination">
              <button @click="changePage(1)">Início</button>
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
              <div class="paginationText"> <b>{{ currentPage }}</b> de {{ totalPages }}</div>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Próxima</button>
              <button @click="changePage(totalPages)">Fim</button>
            </div>
            <div class="itemsSelector">
              <div>Exibindo {{ exibindo }} de {{ totalItems }}</div>
            </div>
          </div>
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
import cadastroPlanosPopup from './popups/cadastroPlanosPopup.vue'
import deletarPlanosPopup from './popups/deletarPlanosPopup.vue'
import editarPlanosPopup from './popups/editarPlanosPopup.vue'
import { ref } from 'vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, retornaCidade, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        cadastroPlanosPopup,
        editarPlanosPopup,
        deletarPlanosPopup,
    },
    name: 'planosComponent',
    data() {
        return {
            loading: false,
            isMobile: window.innerWidth < 768,
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            showDeletePlanosPopup: false,
            showEditarPlanosPopup: false,
            showCadastroPlanosPopup: false,
            semResultado: false,
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: 0,
            exibindo: 10,
            dataExclusao: '',
            dataEdicao: '',
            planos: [],

        }
    },
    computed: {
        paginatedItems() {
            if (!this.planos || !Array.isArray(this.planos)) {
                return [];
            }

            return this.planos;
        },
        totalPages() {
            var aux = Math.ceil(this.totalItems / this.itemsPerPage);
            if (aux == 0) {
                aux = 1;
            }
            return aux;
        },
    },
    mounted() {
        if (this.perfil != 'Admin'){
            this.$router.push({name: 'home'})
        }
        this.getPlanos();
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
        changeItemsPerPage() {
            this.currentPage = 1;
            this.getPlanos();

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
            this.getPlanos();
        },
        openCadastroPlanosPopup() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showCadastroPlanosPopup = true;
        },
        closeCadastroPlanosPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getPlanos();
            this.showCadastroPlanosPopup = false;
        },
        openEditarPlanosPopup(data) {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.dataEdicao = data;
            this.showEditarPlanosPopup = true;
        },
        closeEditarPlanosPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getPlanos();
            this.showEditarPlanosPopup = false;
        },
        openDeletePlanosPopup(data) {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.dataExclusao = data;
            this.showDeletePlanosPopup = true;
        },
        closeDeletePlanosPopup() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.getPlanos();
            this.showDeletePlanosPopup = false;
        },
        async getPlanos() {
            this.loading = true;
            this.semResultado = false;
            var start = (this.currentPage - 1) * this.itemsPerPage;
            await axios.get(`${store.state.apiUrl}/public/planos?&start=${start}&quantity=${this.itemsPerPage}`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.planos = response.data;
                    this.totalItems = this.planos.length;

                    if (this.totalItems < this.itemsPerPage) {
                        this.exibindo = this.totalItems;
                    } else {
                        this.exibindo = this.itemsPerPage;
                    }
                    this.loading = false;
                })
                .catch((error) => {
                    this.totalItems = 1;
                    if (this.totalItems < this.itemsPerPage) {
                        this.exibindo = this.totalItems;
                    } else {
                        this.exibindo = this.itemsPerPage;
                    }
               
                    this.semResultado = true;
                    this.loading = false;
                });
        },
        formatData(dateString) {
            const date = new Date(dateString);
            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();

            return `${dia}/${mes}/${ano}`;
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

.conteudoExibido {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 90%;
  border-radius: 15px;
  margin: 3%;
  margin-right: 2.8%;
  color: white;
  background-color: #fff;
  box-shadow: 0 0 3px black;
  padding: 2%;
}

.headerTable {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 15px;

}

.itemsSelector {
  display: flex;
  justify-content: center;
  align-items: center;
}

.itemsSelector div {
  color: black;
}

.itemsSelector select {
  margin: 0 10px;
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

table {
  color: black;
  border-collapse: collapse;
  margin: 2% 0;
  padding: 0;
  width: 100%;
  table-layout: auto;
  border-radius: 15px;
}

table thead tr {
  background: var(--cor-principal);
}

table caption {
  font-size: 1.5em;
  margin: .5em 0 .75em;
}

table tr {
  background-color: white;
  border: 1px solid #ddd;
  padding: .35em;
}

table th,
table td {
  padding: .625em;
  text-align: center;
}

table th {
  font-size: .85em;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #fff;
  transition: 0.5s ease-in-out;
}

table th:hover:not(.acoes) {
  transform: scale(1.1);
  cursor: pointer;

}

.btnEditar {
  width: 20px;

}

.btnEditar:hover {
  transform: scale(1.05);
  transition: 0.2ms;
}

@media screen and (max-width: 600px) {


table {
  border: 0;
}

table caption {
  font-size: 1.3em;
}

table thead {
  border: none;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;

}

table tr {
  border-bottom: 3px solid #ddd;
  display: block;
  margin-bottom: .625em;
}

table td {
  border-bottom: 1px solid #ddd;
  display: block;
  font-size: .8em;
  text-align: right;
}


table td::before {

  content: attr(data-label);
  float: left;
  font-weight: bold;
  text-transform: uppercase;
}

table td:last-child {
  border-bottom: 0;
}

.headerTable{
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.itemsSelector{
    width: 100%;
    justify-content: space-between;
}

.itemsSelector select{
    width: 30%;
}

.pagination{
    margin: 0 auto;
}

.itemsSelector:last-child{
    justify-content: center;
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
}

@media(max-width: 767px) {

    .containerSmall {
        padding: 0;
        margin-top: 9rem;
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
