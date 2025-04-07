<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">Teste de Fagerström</div>
        <p>Seja bem-vindo ao CETTA! Ficamos felizes com a sua decisão! Agora, faremos algumas perguntas utilizando o
            Teste de Fagerström, que serve para verificar o seu grau de dependência à nicotina. Para isso, pedimos que
            você seja o mais fiel possível nas suas respostas, assinalando sempre a opção que mais se adequa a você.</p>
            <div class="grid-info">
                <div class="form-group" style="text-align: left;">
                    <label for="questao1">1. Em quanto tempo depois de acordar você fuma o primeiro cigarro?</label>
                    <div>
                        <label for="questao11" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao11" value="Dentro de 5 minutos" v-model="questao1"> Dentro de 5 minutos
                        </label>
                    </div>
                    <div>
                        <label for="questao12" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao12" value="6-30 minutos" v-model="questao1"> 6-30 minutos
                        </label>
                    </div>
                    <div>
                        <label for="questao13" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao13" value="31-60 minutos" v-model="questao1"> 31-60 minutos
                        </label>
                    </div>
                    <div>
                        <label for="questao14" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao14" value="Depois de 60 minutos" v-model="questao1"> Depois de 60 minutos
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="questao2">2. Você acha difícil ficar sem fumar em locais onde é proibido?</label>
                    <div>
                        <label for="questao2" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao2" value="Sim" v-model="questao2"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="questao22" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao22" value="Não" v-model="questao2"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="questao3">3. Qual o cigarro do dia que lhe traz mais satisfação?</label>
                    <div>
                        <label for="questao33" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao33" value="O primeiro da manhã" v-model="questao3"> O primeiro da manhã
                        </label>
                    </div>
                    <div>
                        <label for="questao34" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao34" value="Outros" v-model="questao3"> Outros
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="questao2">4. Quantos cigarros você fuma por dia? (Lembre-se que um maço contém 20 cigarros)</label>
                    <div>
                        <label for="questao41" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao41" value="Menos de 10" v-model="questao4"> Menos de 10
                        </label>
                    </div>
                    <div>
                        <label for="questao42" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao42" value="De 11 a 20" v-model="questao4"> De 11 a 20
                        </label>
                    </div>
                    <div>
                        <label for="questao43" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao43" value="De 21 a 30" v-model="questao4"> De 21 a 30
                        </label>
                    </div>
                    <div>
                        <label for="questao44" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao44" value="Mais de 31" v-model="questao4"> Mais de 31
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="questao2">5. Você fuma mais frequentemente pela manhã?</label>
                    <div>
                        <label for="questao51" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao51" value="Sim" v-model="questao5"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="questao52" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao52" value="Não" v-model="questao5"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="questao2">6. Você fuma mesmo doente, quando precisa ficar de cama a maior parte do tempo?</label>
                    <div>
                        <label for="questao6" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao6" value="Sim" v-model="questao6"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="questao62" class="radio-label">
                            <input type="radio" :disabled="!fagerstrom" id="questao62" value="Não" v-model="questao6"> Não
                        </label>
                    </div>
                </div>
            </div>
        <div class="buttons" v-if="fagerstrom">
            <button class="atualizar" @click="postQuetionario">Atualizar</button>
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
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, RemoveMascaraCNPJ, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
import { ref } from 'vue';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
    },
    name: 'questionarioComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            autenticacao: store.state.autenticacao,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            questao1: '',
            questao2: '',
            questao3: '',
            questao4: '',
            questao5: '',
            questao6: '',
            fagerstrom: store.state.dadosPessoais.fagerstrom,
            loading: false,
        }
    },
    mounted() {
        this.carregarDados()
    },
    methods: {
        async carregarDados() {
            console.log(this.fagerstrom)
            if (this.perfil == 'Usuario') {
                await axios.get(`${store.state.apiUrl}/users/questionario`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.questao1 = response.data.questionario.questao1;
                    this.questao2 = response.data.questionario.questao2;
                    this.questao3 = response.data.questionario.questao3;
                    this.questao4 = response.data.questionario.questao4;
                    this.questao5  = response.data.questionario.questao5;
                    this.questao6  = response.data.questionario.questao6;
                    this.loading = false;
                })
                .catch((error) => {
                    this.semResultado = true;
                    this.loading = false;
                });
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async postQuetionario() {
            try {
                this.loading = true;
                this.fecharModal()

                const data = {
                    "questionario": {
                        "questao1": this.questao1,
                        "questao2": this.questao2,
                        "questao3": this.questao3,
                        "questao4": this.questao4,
                        "questao5": this.questao5,
                        "questao6": this.questao6
                    }
                }
                await axios.post(`${store.state.apiUrl}/users/questionario`,
                    data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(async (response) => {
                        this.loading = false;
                        this.fecharModal()
                        this.fagerstrom = false;
                        this.mensagemSucesso = "Teste atualizado com sucesso."
                    })
                    .catch((error) => {
                        this.fecharModal();
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                        this.loading = false;
                    });
            } catch (error) {
                console.log(error)
            }

        },
    }
}
</script>

<style scoped>
.containerSmall {
    width: 95%;
    border-radius: 15px;
    padding: 5%;
    background-color: #F2F2F2;
    margin: 5rem auto;
    position: relative;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.title {
    font-size: 2rem;
    color: var(--cor-preto);
    font-weight: bold;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 1rem;
    width: 100%;
}

p {
    margin: 0 auto;
    text-align: center;
    margin-bottom: 3rem;
}

.info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: center;
    align-items: start;
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
    grid-template-columns: repeat(2, 1fr); 
    gap: 1rem;
    width: 100%;
}

@media (max-width: 768px) { 
    .grid-info {
        grid-template-columns: 1fr;
    }
}


.form-group {
    display: flex;
    flex-direction: column;
}

.fa-edit {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 2rem;
    cursor: pointer;
    color: var(--cor-preto);

}

.fa-edit:hover {
    transform: scale(1.02);

}

.buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: end;
    gap: 15px;
}

.buttons button {
    border-radius: 15px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--cor-branco);
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.cancelar {
    padding: 1rem;
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
}

.atualizar {
    padding: 1rem 2rem;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border: 1px solid var(--cor-principal);
}

.atualizar:hover {
    background: transparent;
    color: var(--cor-principal);
}

.cancelar:hover {
    background-color: transparent;
    color: var(--cor-preto);
}

input[type="radio"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--cor-principal);
    transition: border-color 0.3s ease;
    box-sizing: border-box;

}

input[type="radio"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

.radio-label {
    display: flex;
    align-items: center;
    font-weight: 400;
    gap: 10px;
}

label{
    font-weight: bold;
}

@media (min-width: 768px) {
    .info {
        grid-template-columns: 30% 70%;
    }


    .form-group {
        flex-direction: column;
        align-items: start;
    }

    .form-group label {
        margin-right: 1rem;
    }

    .form-group input {
        flex: 2;
    }

    .title {
        text-align: left;
        font-size: 3rem;
    }

    .containerSmall {
        width: 100%;
    }
}

@media (min-width: 1200px) {
    .info {
        grid-template-columns: 20% 80%;
        align-items: center;
        justify-items: center;
    }

}
</style>
