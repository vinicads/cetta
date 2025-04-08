<template>
    <div class="grupo-container">
        <h2 class="titulo">Participantes do Grupo</h2>

        <div v-if="semResultado"
            style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 40px; color: #555; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">😕</div>
            <p style="font-size: 18px; font-weight: 500;">Nenhum participante encontrado neste grupo.</p>
        </div>

        <div class="usuarios-lista" v-if="!semResultado">
            <div v-for="usuario in grupo.contas" :key="usuario.idConta" class="usuario-card"
                @mouseover="mostrarIcone(usuario.idConta)" @mouseleave="ocultarIcone(usuario.idConta)">
                <div class="avatar-wrapper">
                    <img v-if="!usuario.foto || usuario.foto === 'semFoto'" src="@/assets/icons/semFoto.png"
                        alt="Sem foto" class="avatar" />
                    <img v-else :src="`${apiUrl}/public/files/${usuario.foto}`" alt="Foto do usuário" class="avatar" />

                    <div v-if="perfil !== 'Usuario'" class="acoes-icones"
                        :class="{ visivel: hoverId === usuario.idConta }">
                        <div class="icone" @click.stop="abrirUsuario(usuario)" title="Abrir">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="icone" @click.stop="excluirUsuario(usuario.idConta)" title="Excluir">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>

                </div>
                <p class="nome">{{ usuario.nome }}</p>
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
    <visualizarUsuarioPopup @close="selectedUser = null;" :usuario="selectedUser" v-if="selectedUser" />
    <deletarUsuariosPopup @close="idSelected = null; fetchGrupo()" :idConta="idSelected" :idGrupo="idGrupo" v-if="idSelected" />
</template>

<script>
import store from '@/auth/autenticacao'
import axios from 'axios'
import Mensagem from '../../../alertas/mensagensTemp.vue'
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import visualizarUsuarioPopup from '../popups/visualizarUsuarioPopup.vue';
import deletarUsuariosPopup from '../popups/deletarUsuariosPopup.vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        visualizarUsuarioPopup,
        deletarUsuariosPopup
    },
    props: {
        idGrupo: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            grupo: [],
            hoverId: null,
            apiUrl: store.state.apiUrl,
            perfil: store.state.perfil,
            selectedUser: null,
            idSelected: null,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,
            semResultado: false,
        }
    },

    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async fetchGrupo() {
            this.semResultado = false
            try {
                const { data } = await axios.get(`${this.apiUrl}/grupos/${this.idGrupo}`, { withCredentials: true })
                this.grupo = data;

            } catch (error) {
                this.semResultado = true;
            }
        },
        excluirUsuario(idConta){
            this.idSelected = idConta;
        },
        mostrarIcone(id) {
            this.hoverId = id
        },
        ocultarIcone() {
            this.hoverId = null
        },
        abrirUsuario(usuario) {
            this.selectedUser = usuario;
        }
    },
    mounted() {
        this.fetchGrupo()
    }
}
</script>

<style scoped>
.grupo-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
}

.titulo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    text-align: left;
}

.usuarios-lista {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
}

.usuario-card {
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    padding: 16px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease;
    position: relative;
}

.usuario-card:hover {
    transform: translateY(-4px);
}

.avatar-wrapper {
    width: 80px;
    height: 80px;
    margin: 0 auto 10px;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    object-fit: cover;
}

.acoes-icones {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.acoes-icones.visivel {
    opacity: 1;
}

.acoes-icones .icone {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: white;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.acoes-icones .icone:hover {
    transform: scale(1.1);
}

.nome {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}
</style>
