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

    <section class="planos" v-if="temPlanos">
        <div class="display">
            <planosHome  @semPlanos="temPlanos = false;"/>
        </div>
    </section>

    <section>
        <div class="display">
            <cadastrosTemp />
        </div>
    </section>

    <section class="mensagens">
        <div class="display">
            <avaliacaoTemp />
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
import cadastrosTemp from './components/cadastrosTemp.vue'
import avaliacaoTemp from './components/avaliacoesTemp.vue'
import faqTemp from './components/faqTemp.vue'
export default {
    components: {
        Mensagem,
        headerTemp,
        sobreTemp,
        planosHome,
        cadastrosTemp,
        avaliacaoTemp,
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
}

.mensagens{
    background-color: var(--cor-principal);
}

section{
    margin-block: 5rem;
}
</style>