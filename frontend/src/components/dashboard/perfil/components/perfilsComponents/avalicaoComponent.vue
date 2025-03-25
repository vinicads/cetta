<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="star-rating">
        <div v-for="n in 5" :key="n" @click="ratingClicked(n)" :class="{ 'filled': n <= selectedRating }">
            ★
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import Mensagem from '../../../../alertas/mensagensTemp.vue';
export default {
    props: {
        note: {
            type: Number,
            default: 0,
            validator: note => note >= 0 && note <= 5
        },
        idRecrutador: {
            type: Number
        },
    },
    components: {
        Mensagem,
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            selectedRating: 0 
        }
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async ratingClicked(clickedRating) {
            try {
        
                const data = {
                    "avaliacoes": {
                        idRecrutador: this.idRecrutador,
                        nota: clickedRating
                    }
                }
                const response = await axios.post(`${this.apiUrl}/avaliacoes`, data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.fecharModal();
                if (response.status == 200) {
                    this.selectedRating = clickedRating;
                }
            } catch (error) {
                let mensagem;
                this.fecharModal();
                if (error.response.data) {
                    if (error.response.data.message) {
                        if (typeof (error.response.data.message) == 'string') {
                            mensagem = error.response.data.message;
                        } else {
                            mensagem = error.response.data.message[0];
                        }
                    } else {
                        mensagem = error.response.data;
                    }

                    if (typeof (mensagem) == 'object') {
                        mensagem = 'Método não encontrado.';
                    }

                    this.mensagemErro = mensagem;

                } else {
                    this.mensagemErro = "Algo deu errado.";
                }
            }
        }
    },
    watch: {
        note(newNote) {
            this.selectedRating = newNote;
        }
    }
};
</script>

<style>
.star-rating {
    font-size: 2rem;
    position: relative;
    margin: 1% 2%;
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 0;
}

.star-rating div {
    display: inline-block;
    transition: color 0.3s;
}

.star-rating div:hover {
    transform: scale(1.05);
}

.star-rating div.filled {
    color: var(--cor-principal);
}
</style>
