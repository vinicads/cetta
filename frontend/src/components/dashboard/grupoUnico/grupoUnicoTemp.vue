<template>
    <div class="display" style="margin-top: 8rem;">
        <div class="grupo-container">
            <div class="content-wrapper">
                <!-- Header -->
                <div class="group-header">
                    <h1 class="group-title">Grupo {{ grupo.idGrupo }}</h1>
                    <div class="link-wrapper" v-if="grupo.link">
                        <input v-model="grupo.link" type="text" readonly class="link-input" />
                        <div class="link-buttons">
                            <button @click="copiarLink" class="icon-button">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button @click="abrirLink" class="icon-button">
                                <i class="fas fa-external-link-alt"></i>
                            </button>
                        </div>
                    </div>

                    <div class="buttons" v-if="perfil != 'Usuario'">
                        <button @click="adicionarParticipante" class="action-button">
                            <i class="fas fa-user-plus mr-2"></i> Adicionar Participantes
                        </button>
                    </div>
                </div>

                <div class="card-grupo">
                    <div class="cabecalho">
                        <h3>📆 Dias & Horários</h3>
                        <ul>
                            <li v-for="data in grupo.datas" :key="data.idData">
                                <i class="fas fa-calendar-day"></i> {{ data.dia }}
                                <i class="fas fa-clock"></i> {{ data.hora }}
                            </li>
                        </ul>
                    </div>

                    <div class="data-final">
                        <i class="fas fa-flag-checkered"></i>
                        <span>Iniciou em: {{ formatarData(grupo.dataInicio) }}</span>
                    </div>

                    <div class="data-final">
                        <i class="fas fa-flag-checkered"></i>
                        <span>Termina em: {{ formatarData(grupo.dataFinal) }}</span>
                    </div>

                    <div class="participantes">
                        <i class="fas fa-users" style="margin-right: 10px;"></i>
                        <span>
                            {{ grupo.contas?.length }} / {{ grupo.planos?.qtdePessoas }} participantes
                            <span v-if="excedeuLimite" class="alerta">⚠️ Limite excedido!</span>
                        </span>
                        <div class="barra">
                            <div class="progresso" :style="{ width: progresso + '%' }"
                                :class="{ vermelho: excedeuLimite }"></div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs-wrapper">
                    <button v-for="(tab, index) in tabs" :key="index" @click="currentTab = tab"
                        :class="['tab-button', { active: currentTab === tab }]">
                        {{ tab }}
                    </button>
                </div>

                <!-- Conteúdo -->
                <div class="tab-content animate-fade-in">
                    <div v-if="currentTab === 'Participantes'">
                        <usuariosTemp v-if="idGrupo" :idGrupo="idGrupo" />
                    </div>
                    <div v-else-if="currentTab === 'Arquivos'">
                        <arquivosTemp v-if="idGrupo" :idGrupo="idGrupo" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <selecionarUsuarioPopup v-if="selecionarUsuario" :idGrupo="idGrupo" @fechar="selecionarUsuario = false;" />
    <copyLinkTemp v-if="copyLinkPopup" @closed="copyLinkPopup = false" />
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
</template>

<script>
import store from '@/auth/autenticacao';
import axios from 'axios';
import Mensagem from '../../alertas/mensagensTemp.vue';
import copyLinkTemp from './popups/copyLinkTemp.vue';
import arquivosTemp from './components/arquivosTemp.vue'
import selecionarUsuarioPopup from './popups/selecionarUsuarioPopup.vue';
import usuariosTemp from './components/usuariosTemp.vue';
export default {
    components: {
        Mensagem,
        copyLinkTemp,
        arquivosTemp,
        selecionarUsuarioPopup,
        usuariosTemp
    },
    data() {
        return {
            grupo: {},
            idGrupo: null,
            currentTab: 'Participantes',
            tabs: ['Participantes', 'Arquivos'],
            contas: [],
            plano: {},
            copyLinkPopup: false,
            selecionarUsuario: false,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            perfil: null
        };
    },
    mounted() {
        this.perfil = store.state.perfil;
        this.getGrupo();
        this.idGrupo = this.$route.params.id;
    },
    computed: {
        progresso() {
            const atual = this.grupo.contas?.length;
            const max = this.grupo.planos?.qtdePessoas;
            return Math.min(100, (atual / max) * 100);
        },
        excedeuLimite() {
            return this.grupo.contas?.length > this.grupo.planos?.qtdePessoas;
        }
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async getGrupo() {
            try {
                const id = this.$route.params.id;
                const response = await axios.get(`${store.state.apiUrl}/grupos/${id}`, { withCredentials: true, });

                if (response.status == 200) {
                    this.grupo = response.data;
                    this.contas = response.data.contas;
                    this.plano = response.data.plano;
                } else {
                    this.mensagemErro = 'Algo deu errado';
                }
            } catch (error) {
                this.$router.push('/grupos')
                this.mensagemErro = error.response.data ?? 'Algo deu errado';
            }
        },
        copiarLink() {
            navigator.clipboard.writeText(this.grupo.link);
            this.copyLinkPopup = true
        },
        abrirLink() {
            window.open(this.grupo.link, '_blank');
        },
        adicionarParticipante() {
            this.selecionarUsuario = true;
        },
        formatarData(data) {
            const d = new Date(data)
            return d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    }
};
</script>

<style scoped>
:root {
    --cinza-claro: #f4f4f4;
    --cinza-texto: #4a4a4a;
}

.grupo-container {
    padding: 2rem;
    display: flex;
    border-radius: 15px;
    justify-content: center;
    position: relative;
    margin-block: 1rem;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.content-wrapper {
    width: 100%;
    position: relative;
}

.top-bar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.action-button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco);
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 12px;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.3s ease;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
}

.action-button:hover {
    background: var(--cor-principal);
}

.group-header {
    border-radius: 20px;
    padding: 2rem;
    padding-inline: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 1.5rem;
}

.group-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: var(--cor-principal);
}

.link-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
}

.link-input {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    background: #f9f9f9;
    flex: 1;
    min-width: 250px;
    max-width: 400px;
    color: var(--cinza-texto);
}

.link-buttons {
    display: flex;
    gap: 0.5rem;
}

.icon-button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco);
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease;
}

.icon-button:hover {
    background: var(--cor-secundaria);
}

.tabs-wrapper {
    margin: 2rem 0 1rem;
    margin-bottom: 0;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.tab-button {
    padding: 0.6rem 1.8rem;
    border-radius: 15px 15px 0 0;
    border: 2px solid var(--cor-principal);
    background: transparent;
    color: var(--cor-principal);
    font-weight: 600;
    transition: 0.3s ease;
    cursor: pointer;
    border-bottom: none;
}

.tab-button.active {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tab-button:hover {
    background-color: rgba(3, 75, 120, 0.1);
}

.tab-content {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border-radius: 0 15px 15px 15px;
    padding: 2rem;
}

.tab-text {
    font-size: 1.1rem;
    color: var(--cinza-texto);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

.card-grupo {
    background: #f9fbff;
    border: 1px solid var(--cor-principal);
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 64, 128, 0.1);
    width: 100%;
    margin: auto;
    font-family: 'Segoe UI', sans-serif;
}

.card-grupo h3 {
    margin-bottom: 8px;
    color: var(--cor-principal);
}

.card-grupo ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.card-grupo li {
    margin-bottom: 6px;
    font-size: 15px;
    color: #333;
}

.data-final {
    margin-top: 12px;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
    gap: 8px;
}

.participantes {
    margin-top: 16px;
    font-size: 14px;
    color: #444;
}

.barra {
    height: 10px;
    background: #e0e0e0;
    border-radius: 5px;
    margin-top: 6px;
    overflow: hidden;
}

.progresso {
    height: 100%;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    transition: width 0.4s ease;
}

.participantes.excedido span {
  color: #d40000;
  font-weight: bold;
}

.alerta {
  margin-left: 8px;
  font-size: 12px;
  color: #d40000;
  font-style: italic;
}

.progresso.vermelho {
  background: linear-gradient(to right, #ff5e5e, #d40000);
}


@media (max-width: 842px) {
    .grupo-container {
        flex-direction: column;
        padding: 0.5rem;
    }

    .top-bar {
        position: relative;
        top: 0;
        right: 0;
        justify-content: center;
    }

    .group-header {
        flex-direction: column;
        padding: 0.5rem;
        padding-inline: 0;
        margin-top: 1rem;
    }

    .tab-content {
        padding: 0.5rem;
    }
}

/* Responsivo */
@media (max-width: 768px) {

    .link-wrapper {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }

    .link-input {
        max-width: 100% !important;
        width: 100%;
    }

    .icon-button {
        width: 100%;
        border-radius: 10px;
    }

    .tab-button {
        padding: 0.3rem;
    }

}
</style>