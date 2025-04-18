<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />

    <section style="margin: 0;">
        <headerTemp />
    </section>

    <section>
        <div class="display">
            <sobreTemp />
        </div>
    </section>

    <section class="display background" style="margin-bottom: 0;">
        <quemSouEuTemp />
    </section>

    <section class="display">
        <metodologiaTemp />
    </section>

    <section class="display background">
        <comoFuncionaTemp />
    </section>

    <section class="display">
        <transformeSuaJornadaTemp />
    </section>

    <section class="planos background" v-if="temPlanos">
        <div class="display">
            <planosHome  @semPlanos="temPlanos = false;"/>
        </div>
    </section>

    <section>
        <div class="display">
            <faqTemp />
        </div>
    </section>

</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import Mensagem from '../alertas/mensagensTemp.vue';
import { ref } from 'vue';
import headerTemp from './components/headerTemp.vue'
import sobreTemp from './components/sobreTemp.vue'
import planosHome from './components/planosHome.vue'
import faqTemp from './components/faqTemp.vue'
import quemSouEuTemp from "./components/quemSouEuTemp.vue";
import comoFuncionaTemp from "./components/comoFuncionaTemp.vue";
import transformeSuaJornadaTemp from "./components/transformeSuaJornadaTemp.vue";
import metodologiaTemp from "./components/metodologiaTemp.vue";
export default {
    components: {
        Mensagem,
        headerTemp,
        sobreTemp,
        planosHome,
        quemSouEuTemp,
        comoFuncionaTemp,
        transformeSuaJornadaTemp,
        metodologiaTemp,
        faqTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            headerTemp: '',
            temPlanos: true,
        }
    },
    mounted() {
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
    }
}
</script>

<style scoped>

.planos{
    background-color: #F9F9F9;
    padding: 5% 0;
    margin-top: 0;
}

.background{
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
}

.mensagens{
    background-color: var(--cor-principal);
}

section{
    margin-block: 5rem;
}
</style>