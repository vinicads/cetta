<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />

    <section class="profile">
        <div class="display">
            <perfilTemp :idRecrutador="Number(idRecrutador)" @naoAutorizado="naoAutorizado" />
        </div>
    </section>

    <section>
        <div class="display">
            <fretesComponent :idRecrutador="Number(idRecrutador)" @naoAutorizado="naoAutorizado" />
        </div>
    </section>

</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import Mensagem from '../../../alertas/mensagensTemp.vue';
import perfilTemp from './components/perfilTemp.vue'
import fretesComponent from './components/fretesComponent.vue'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        perfilTemp,
        fretesComponent
    },
    data() {
        return {
            assinatura: store.state.assinatura,
            autenticacao: store.state.autenticacao,
            perfil: store.state.perfil,
            dadosPessoais: store.state.dadosPessoais,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            idRecrutador: 0,
        }
    },
    watch: {
        '$route.params.id': {
            handler(newVal) {
                this.idRecrutador = newVal;
            },
            immediate: true
        }
    },
     mounted() {
            this.idRecrutador = this.$route.params.id || 0;
        },
        methods: {
            naoAutorizado(){
                this.$router.push('/home');
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
.profile {
    margin-top: 8rem;
}
</style>