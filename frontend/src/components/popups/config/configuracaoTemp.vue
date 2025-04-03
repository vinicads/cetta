<template>
    <div class="popup-container" @click="fecharComCliqueExterno">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="fecharModal">&times;</button>
            <h2>Configurações</h2>

            <div v-if="isDesktop" class="layout-desktop">
                <MenuComponent :items="items" @select-item="selectItem" />
                <ContentComponent v-if="selectedItem" :selectedItem="selectedItem" />
            </div>
            <div v-else class="layout-mobile">
                <MenuComponent v-if="showMenu" :items="items" @select-item="selectItem" />
                <ContentComponent v-if="!showMenu" :selectedItem="selectedItem" @back="showMenu = true" />
            </div>
        </div>
    </div>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharMensagem" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharMensagem" />
</template>




<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import MenuComponent from './menuComponent.vue';
import ContentComponent from './contentComponent.vue';
import axios from 'axios';
import store from '@/auth/autenticacao.js';

export default {
    components: {
        Mensagem,
        MenuComponent,
        ContentComponent
    },
    emits: ['fecharConfiguracoes'],
    data() {
        return {
            apiUrl: store.state.apiUrl,
            autenticacao: store.state.autenticacao,
            dadosPessoais: store.state.dadosPessoais,
            assinatura: store.state.assinatura,
            historicoPagamento: store.state.historicoPagamento,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,
            items: [],
            selectedItem: 0,
            showMenu: true,
            isDesktop: false,
        };
    },
    methods: {
        fecharMensagem() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        fecharComCliqueExterno(event) {
            if (event.target.classList.contains('popup-container')) {
                this.fecharModal();
            }
        },
        fecharComEsc(event) {
            if (event.key === 'Escape') {
                this.fecharModal();
            }
        },
        fecharModal() {
            this.$emit('fecharConfiguracoes');
        },
        selectItem(id) {
            this.selectedItem = this.items.find(item => item.id === id);
            this.showMenu = false;
        },
        handleResize() {
            this.isDesktop = window.innerWidth >= 768;
            if (this.isDesktop) {
                this.showMenu = true;
            }else{
                this.selectItem(1)
            }
        },
        carregarDados(){
            if (this.perfil == "Usuario"){
              this.items = [
                { id: 1, name: 'Dados Pessoais'},
                { id: 2, name: 'Assinaturas'},
                { id: 3, name: 'Histórico de pagamentos'},
            ]
            }else{
                this.items = [
                { id: 1, name: 'Dados Pessoais'},
            ]
            }


            if (this.isDesktop){
                this.selectItem(1)
            }else{
                this.showMenu = true;
            }
        
        }
    },
    mounted() {
        this.isDesktop = window.innerWidth >= 768;
        this.carregarDados()
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.fecharComEsc);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.fecharComEsc);
    }
};
</script>

<style scoped>
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
}

.popup-content {
    position: relative;
    background: #f2f2f2;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 60%;
    height: 80%;
    text-align: left;
    color: var(--cor-preto);
    z-index: 1001;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--cor-preto) !important;
}

.loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #37373763;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999999999999999999999;
    color: var(--textColor-title);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--cor-principal);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.layout-desktop {
    display: flex;
    height: 90%;
}

.layout-desktop .menu {
    width: 200px;
}

.layout-desktop .content {
    flex-grow: 1;
    padding: 20px;
}

.layout-mobile .menu,
.layout-mobile .content {
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .layout-mobile {
        display: none;
    }

    .layout-desktop {
        display: flex;
    }
}

@media (max-width: 767px) {
    .layout-desktop {
        display: none;
    }

    .layout-mobile {
        display: block;
        height: 90%;
        width: 100%;
    }

    h2{
        font-size: 1.5rem;
    }

    .popup-content{
        width: 95%;
        height: 90%;
        padding: 10px;
    }
}
</style>
