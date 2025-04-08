<template>
    <div class="popup-overlay">
        <div class="popup-card">
            <!-- Fechar -->
            <button class="icon-button close-btn" @click="fecharPopup">
                <i class="fas fa-times"></i>
            </button>

            <!-- Título e filtro -->
            <div class="popup-header">
                <h2>Selecionar Usuário</h2>
                <input type="text" v-model="filtroNome" placeholder="Buscar por nome..." @input="buscarUsuarios" />
            </div>
            <!-- Lista de usuários -->
            <div class="usuarios-lista">
                <div v-for="usuario in paginatedItems" :key="usuario.id" class="usuario-card"
                    :class="{ selecionado: usuariosSelecionados.includes(usuario.conta.idConta) }"
                    @click="selecionarUsuario(usuario.conta.idConta)">
                    <div class="avatar">
                        <img src="../../../../assets/icons/semFoto.png" v-if="!usuario.conta.foto || usuario.conta.foto == 'semFoto'" alt="">
                        <img :src="`${apiUrl}/public/files/${usuario.conta.foto}`" v-else alt="">
                    </div>
                    <div class="info">
                        <p class="nome">{{ usuario.conta.nome }}</p>
                    </div>
                </div>
            </div>

            <!-- Paginação -->
            <div class="headerTable">
                <div class="pagination">
                    <button @click="changePage(1)">Início</button>
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
                    <div class="paginationText">
                        <b>{{ currentPage }}</b> de {{ totalPages }}
                    </div>
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Próxima</button>
                    <button @click="changePage(totalPages)">Fim</button>
                </div>
                <div class="itemsSelector">
                    <div>Exibindo {{ exibindo }} de {{ totalItems }}</div>
                </div>
            </div>
            <div class="button" style="display: flex;align-items: center; justify-content: end; margin-top: 1rem;">
                <button class="icon-button" @click="adicionarUsuario()" style="width: 10rem; border-radius: 15px;">Selecionar</button>
            </div>
        </div>
    </div>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <popupCarregamentoTemp v-if="loading" />
</template>

<script>
import axios from 'axios';
import store from '@/auth/autenticacao';
import Mensagem from '../../../alertas/mensagensTemp.vue'
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
    },
    props: {
        idGrupo: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
            filtroNome: '',
            usuarios: [],
            usuariosSelecionados: [],
            loading: false,
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            exibindo: 10,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,
        };
    },
    computed: {
        totalPages() {
            const aux = Math.ceil(this.totalItems / this.itemsPerPage);
            return aux === 0 ? 1 : aux;
        },
        paginatedItems() {
            return this.usuarios;
        },
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async buscarUsuarios() {
            this.currentPage = 1;
            await this.getUsuarios();
        },
        async adicionarUsuario(){
            this.loading = true;
            this.mensagemAlerta = '';
            this.mensagemErro = '';
            this.mensagemSucesso = '';

            const data = {
                "contasIDS": this.usuariosSelecionados,
                "idGrupo": Number(this.idGrupo)
            }

            await axios.post(`${store.state.apiUrl}/grupos/inserir/usuario`,
                data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.fecharModal()
                    this.mensagemSucesso = "Usuários inseridos com sucesso"
                    this.fecharPopup()
                })
                .catch((error) => {

                    this.mensagemErro = error.response.data ?? 'Algo deu errado.';
                    this.loading = false;
                });
        },
        async getUsuarios() {
            this.loading = true;
            const start = (this.currentPage - 1) * this.itemsPerPage;
            try {
                const response = await axios.get(
                    `${store.state.apiUrl}/users?start=${start}&quantity=${this.itemsPerPage}&nome=${this.filtroNome}&perfil=Usuario`,
                    { withCredentials: true }
                );
                this.usuarios = response.data.usuarios;
                this.totalItems = response.data.count;
                this.exibindo = Math.min(this.totalItems, this.itemsPerPage);
            } catch (error) {
                this.usuarios = [];
                this.totalItems = 1;
                this.exibindo = 0;
            } finally {
                this.loading = false;
            }
        },
        changePage(page) {
            if (page < 1) page = 1;
            if (page > this.totalPages) page = this.totalPages;
            this.currentPage = page;
            this.getUsuarios();
        },
        selecionarUsuario(id) {
            if (this.usuariosSelecionados.includes(id)) {
                this.usuariosSelecionados = this.usuariosSelecionados.filter(uid => uid !== id);
            } else {
                this.usuariosSelecionados.push(id);
            }
        },
        fecharPopup() {
            this.$emit('fechar');
        },
    },
    mounted() {
        this.getUsuarios();
    },
};
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.popup-card {
    background: white;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 16px;
    padding: 1.5rem;
    position: relative;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none !important;
    border: none !important;
    color: #000 !important;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.popup-header input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.usuarios-lista {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
}

.usuario-card {
    background: #f4f4f4;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    transition: 0.3s ease;
}

.usuario-card:hover {
    background: #e0f0ff;
}

.usuario-card.selecionado {
    border-color: var(--cor-principal);
    background: #d6f4ff;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #ccc;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.info p{
    margin: 0;
}

.nome {
    font-weight: bold;
    font-size: 1rem;
}

.email {
    font-size: 0.85rem;
    color: gray;
}

/* Pagination */
.headerTable {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 1rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination button {
    width: auto;
    margin: 0 5px;
    border: none;
    background: none;
    color: black;
}

.paginationText {
    margin: 0 5px;
    color: black;
}

.pagination button:hover {
    cursor: pointer;
    transform: scale(1.05);
}

.itemsSelector {
    font-size: 0.9rem;
    color: #333;
}

/* Icon button */
.icon-button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco);
    border: none;
    border-radius: 50%;
    width: 46px;
    height: 46px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease;
}

.icon-button:hover {
    background: var(--cor-secundaria);
}
</style>
