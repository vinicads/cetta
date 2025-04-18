<template>
    <planosTemp :idPlano="idPlano" v-if="showPlanosPopup" @close="closePopupPlanos" />
    <div class="container">
        <div class="title" data-aos="fade-up" data-aos-duration="1000">FAÇA PARTE DO CETTA</div>     
        <div class="subtitle" data-aos="fade-up" data-aos-duration="1200">Cadastre-se e fique por dentro das modalidades de atendimento e planos de tratamento do CETTA</div>     
    </div>
    <div class="containerPlanos">
        <div class="loading" v-if="loading">
            <div class="loading-screen">
                <div class="spinner"></div>
            </div>
        </div>
        <div v-if="!loading && !semResultado" class="planos-grid">
            <div 
                class="plano" 
                v-for="(plano, index) in planos" 
                :key="plano.idPlanos"
                data-aos="fade-up" 
                :data-aos-delay="index * 200" 
                data-aos-duration="1000"
                data-aos-easing="ease-out-cubic"
            >
                <h1>{{ plano.nome }}</h1>
                <h4>{{ plano.descricao }}</h4>
                <div class="valor" v-if="isAuthenticated">
                    <span>R$</span>
                    <strong>{{ aplicarMascaraValorRetorno(plano.valorTotal.toString()) }}</strong>
                    <span>/mês</span>
                </div>
                <div class="button">
                    <button @click="choosePlano(plano.idPlanos)" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="500">Assinar</button>
                </div>
                <div class="linhaPlano"></div>
                <div class="beneficios">
                    <h3>Benefícios</h3>
                    <ul>
                        <li data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                            <img src="../../../assets/icons/check.png" alt="" />
                            <span>{{ plano.meses > 1 ? `${plano.meses} meses de tratamento` : `${plano.meses} mês de tratamento` }}</span>
                        </li>
                        <li data-aos="fade-left" data-aos-duration="1000" data-aos-delay="400">
                            <img src="../../../assets/icons/check.png" alt="" />
                            <span>{{ plano.tipo == 'Grupo' ? `Grupos com até ${plano.qtdePessoas} pessoas.` : `Sessões individuais` }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="!loading && semResultado" class="no-results">
            <p>Nenhum plano disponível no momento.</p>
        </div>
    </div>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro" @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso" @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta" @fechar-modal="fecharModal" />
</template>

<script>
import store from '@/auth/autenticacao';
import axios from 'axios';
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import planosTemp from '../../dashboard/planos/planosTemp.vue'
import { verificaCEP, RemoveMascaraCEP } from '@/utils/utils.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        planosTemp
    },
    emits: ['semPlanos'],
    data() {
        return {
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            isAuthenticated: store.state.isAuthenticated,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            showPlanosPopup: false,
            idPlano: null,
            semResultado: false,
            planos: '',
            loading: false,
        }
    },
    methods: {
        choosePlano(idPlanos){
           this.idPlano = idPlanos;
           this.openPopupPlanos()
        },
        openPopupPlanos(){
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showPlanosPopup = true;
        },
        closePopupPlanos(){
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.showPlanosPopup = false;
        },
        aplicarMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d.]/g, '');

            let numero = parseFloat(valorNumerico);

            if (isNaN(numero)) {
                return "0,00";
            }

            let valorFormatado = numero.toFixed(2).replace('.', ',');

            return valorFormatado;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '');
            return valorNumerico;
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        formatData(dateString) {
            const date = new Date(dateString);
            const dia = date.getUTCDate().toString().padStart(2, '0');
            const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const ano = date.getUTCFullYear();
            return `${dia}/${mes}/${ano}`;
        },
        closePopup() {
            this.$emit('close');
        },
        closePopupOnOverlay(event) {
            if (event.target === event.currentTarget) {
                this.closePopup();
            }
        },
        onEscKey(event) {
            if (event.key === 'Escape') {
                this.closePopup();
            }
        },
        async getPlanos() {
            await axios.get(`${store.state.apiUrl}/public/planos`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.planos = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    this.$emit('semPlanos');
                    this.semResultado = true;
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loading = true;
        this.getPlanos();
        AOS.init();
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
    }
}
</script>

<style scoped>
.title {
    color: var(--cor-branco);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.subtitle {
    color: var(--cor-branco);
    font-size: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold; 
}


.containerPlanos {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    overflow-y: auto;
    min-width: 30vw;
    min-height: 50vh;
}

.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 1002;
}

.loading-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-left: 8px solid var(--cor-principal);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.planos-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    overflow-y: hidden;
    justify-content: center;
    align-items: center;
}

.plano {
    background-color: var(--cor-branco);
    border: 1px solid var(--cor-secundaria);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    display: flex;
    width: 450px;
    justify-content: center;
    align-content: center;
    flex-direction: column;
}

.linhaPlano {
    background-color: var(--cor-secundaria);
    height: 1.5px;
    width: 80%;
    margin: 2rem auto;
}

.plano h1 {
    text-align: center;
    font-weight: bold;
    font-size: 2.5em;
}

.plano h4 {
    text-align: center;
    font-size: 1rem;
}


.valor {
    display: flex;
    align-items: center;
    justify-content: center;
    align-items: baseline;
    margin: 10px 0;
    font-weight: bold;
}

.valor span {
    font-size: 1.2em;
}

.valor strong {
    font-size: 3em;
    margin: 0 5px;
}

.button {
    margin: 20px 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button button {
    font-size: 2em;
    font-weight: bold;
    width: 70%;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border: 1px solid var(--cor-principal);
    color: var(--cor-branco);
    border-radius: 15px;
    transition: 0.3s ease-in-out !important;
}

.button button:hover {
    background: none;
    color: var(--cor-principal);
}

.beneficios {
    display: flex;
    justify-content: center;
    align-items: start;
    width: 80%;
    margin: 0 auto;
    flex-direction: column;
}

.beneficios ul {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: start;
    width: 100%;
}

.beneficios ul li {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.beneficios ul li img {
    width: 20px;
    margin-right: 10px;
}

.no-results {
    text-align: center;
    font-size: 1.5em;
    color: #666;
}

@media(max-width: 500px) {
    .plano{
        width: 90%;
    }

}

@media(max-width: 425px) {
    .planos-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .plano h1 {
        font-size: 2rem;

        .planos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            width: 100%;
            height: 90vh;


        }
    }

    .plano h4 {
        font-size: 0.8rem;
    }

    .valor strong {
        font-size: 2rem;
    }

    .button {
        width: 100%;
    }

    .button button {
        width: 100%;
    }

    .beneficios ul li img {
        width: 15px;
    }
}
</style>
