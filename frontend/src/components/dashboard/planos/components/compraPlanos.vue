<template>
    <div class="compras">
        <div class="voltar">
            <button @click="emitirVoltar">
                <img src="../../../../assets/icons/back.png" alt="">
                Voltar</button>
        </div>

        <h2>{{ dadosPlano.nome }}</h2>
        <div class="compra">
            <div class="form-container">
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="text" v-model="precoAtual" disabled>
                </div>
                <div class="form-group">
                    <label>Quantidade de Fretes</label>
                    <input type="number" :value="qtdeFrete" disabled>
                </div>
                <div class="form-group">
                    <label>Quantidade de Contatos</label>
                    <input type="number" :value="qtdeContatos" disabled>
                </div>
                <div class="form-group">
                    <label>Quantidade de meses:</label>
                    <select id="qtdeMeses" class="form-control" @change="verificaValor" v-model="qtdeMeses">
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="6">6</option>
                        </select>
                </div>
                <div class="form-group">
                    <label>Informações úteis:</label>
                    <ul>
                        <li>A compra é irreversível.</li>
                        <li>Ao comprar, você concorda com os <router-link to="/politicas">termos e
                                condições</router-link>.</li>
                        <li>Ao clicar em comprar, vamos redirecioná-lo ao formulário de compras.</li>
                        <li>Quando a compra for confirmada, você receberá os benefícios da assinatura.</li>
                        <li>Na compra de um plano com vários meses, você receberá novos contatos e fretes adicionais a cada mês.</li>
                    </ul>
                </div>
                <div class="form-group">
                    <div>Saldo atual: {{ valorDesconto }}</div>
                    <div class="checkbox-grid">
                        <label class="checkbox-label">
                            <input type="checkbox" @change="verificarValorFinal" v-model="usarDesconto" />
                            Usar saldo disponível
                        </label>
                    </div>
                </div>
            </div>
            <div class="resumo-container">
                <h3>Resumo da Compra</h3>
                <div class="resumo-item">
                    <span>Plano:</span>
                    <span>{{ qtdeMeses == 1 ? 'Mensal' : qtdeMeses == 3 ? 'Trimestral' : 'Semestral' }}</span>
                </div>
                <div class="resumo-item">
                    <span>Preço do plano (por mês):</span>
                    <span>{{ precoAtual }}</span>
                </div>
                <div class="resumo-item">
                    <span>Valor Final:</span>
                    <span>{{ valorFinal }}</span>
                </div>
                <div class="buttons">
                    <button @click="comprarAssinatura" class="botaoPrimario">Comprar</button>
                </div>
            </div>
        </div>
    </div>



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
import Mensagem from '@/components/alertas/mensagensTemp.vue';
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import { verificaCEP, RemoveMascaraCEP } from '@/utils/utils.js';

export default {
    emits: ['close', 'voltar', 'cancelar'],
    components: {
        Mensagem,
        popupCarregamentoTemp,
    },
    data() {
        return {
            perfil: store.state.perfil,
            autenticacao: store.state.autenticacao,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            dadosPlano: '',
            valorMensal: '',
            valorTrimensal: '',
            valorSemestral: '',
            precoAtual: '',
            qtdeContatos: '',
            qtdeFrete: '',
            qtdeMeses: 6,
            valorFinal: 0,
            usarDesconto: false,
            valorDesconto: '',
            loading: false,
        }
    },
    methods: {
        emitirVoltar() {
            this.$emit('voltar');
        },
        verificarValorFinal(){
            let valorAtual = Number(this.removerMascaraValorRetorno(this.precoAtual))
            let valorFinal = valorAtual * this.qtdeMeses;
            if (this.usarDesconto){
                let descontoAtual = Number(this.removerMascaraValorRetorno(this.valorDesconto))
                if (descontoAtual >= valorFinal){
                    this.valorFinal = this.aplicarMascaraValorRetorno('0')
                }else{
                    valorFinal = valorFinal - descontoAtual
                    this.valorFinal = this.aplicarMascaraValorRetorno(valorFinal.toString())
                }
            }else{
                this.valorFinal = this.aplicarMascaraValorRetorno(valorFinal.toString())
            }
        
        },
        aplicarMascaraValorRetorno(valor) {
            let valorNumerico = parseFloat(valor.replace(',', '.').replace(/[^\d.,]/g, ''));
            if (isNaN(valorNumerico)) {
                return "0,00";
            }
            let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            return valorFormatado;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '').replace(',', '.');
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
        async comprarAssinatura() {
            this.loading = true;
            const data = {
              "assinatura": {
                "idPlanos": this.idPlano,
                "qtdeMeses": Number(this.qtdeMeses),
                "usarDesconto": this.usarDesconto
              }
            };

            await axios.post(`${store.state.apiUrl}/pagamentos/assinatura`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.data.urL) {
                        this.loading = false;
                        window.open(response.data.urL, '_blank');
                        store.commit('setPagamentoAtivo', true);
                        this.closePopup()

                    } else {
                        this.mensagemSucesso = response.data.compra;
                    }
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal();
                    if (!store.state.isAuthenticated){
                        if (error.response.status == 403){
                        this.$router.push({name: 'login'})
                        return;
                    }
                    }
                    if (error.response.data) {
                        if (error.response.data.message) {
                            if (Array.isArray(error.response.data.message) && error.response.data.message.length > 0){
                                this.mensagemErro = error.response.data.message[0];
                            }else{
                                this.mensagemErro = error.response.data.message;
                            }
             
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }
                    this.loading = false;
                });
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
        verificaValor(){
            if(this.qtdeMeses == 1){
                this.precoAtual = this.aplicarMascaraValorRetorno(this.valorMensal.toString());
            }else if(this.qtdeMeses == 3){
                this.precoAtual = this.aplicarMascaraValorRetorno(this.valorTrimestral.toString());
            }else{
                this.precoAtual = this.aplicarMascaraValorRetorno(this.valorSemestral.toString());
            }
            this.verificarValorFinal()
        },
        async getDesconto() {
            await axios.get(`${store.state.apiUrl}/desconto/meuDesconto`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.valorDesconto = this.aplicarMascaraValorRetorno(response.data.valor.toString());
                })
                .catch((error) => {
                    this.valorDesconto = this.aplicarMascaraValorRetorno('0');
                    this.semResultado = true;
                    this.loading = false;
                });
        },
        async getPlano() {
            await axios.get(`${store.state.apiUrl}/public/planos`, {
                withCredentials: true,
            })
                .then((response) => {
                    const planos = response.data;
                    const planoEncontrado = planos.find(plano => plano.idPlanos === this.idPlano);
                    if (planoEncontrado) {
                        this.dadosPlano = planoEncontrado;
                        this.qtdeContatos = this.dadosPlano.qtdeContatos;
                        this.qtdeFrete = this.dadosPlano.qtdeFrete;
                        this.valorMensal = this.dadosPlano.valorMensal;
                        this.valorTrimestral = this.dadosPlano.valorTrimestral;
                        this.valorSemestral = this.dadosPlano.valorSemestral;
                        this.verificaValor()
                    } else {
                        this.emitirVoltar()
                        this.semResultado = true;
                    }
                    this.loading = false;
                })
                .catch((error) => {
                    this.emitirVoltar()
                    this.semResultado = true;
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loading = true;
        this.getDesconto();
        this.getPlano();
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    props: {
        idPlano: Number,
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
    }
}
</script>

<style scoped>
.checkbox-grid label {
    display: flex !important;
    align-items: center !important;
    width: 100%;
}

.checkbox-grid input[type="checkbox"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #00000031;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;
    accent-color: var(--cor-principal) !important;
    border-radius: none !important;
    margin-right: 2%;
}

.checkbox-grid input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    accent-color: var(--cor-principal) !important;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}


.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
}



.form-group {
    margin-bottom: 2rem !important;
}

.form-group ul {
    list-style-position: inside;
}

.form-group label {
    display: block;
}

.form-group input[type="text"],
.form-group input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-group p {
    margin: 0;
}

.voltar {
    width: 10%;
    margin-bottom: 2%;
}

.voltar button {
    font-size: 12px;
    width: auto;
    display: flex;
    justify-content: center;
    background-color: none;
    border: none;
    align-items: center;
    transition: 0.3s ease-in-out;
}

.voltar button:hover {
    margin-left: 5px;
}

.voltar img {
    width: 10px;
    margin-right: 5px;
}

.compras {
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
    overflow-y: auto;
    min-width: 30vw;
    margin-top: 1rem;
    flex-direction: column;
    min-height: 50vh;
    padding: 3%;
}

.compra {
    display: flex;
    justify-content: space-between;
    max-height: 70vh;
}

.resumo-container {
    margin-left: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    width: 100%;
    padding: 2%;
    max-width: 300px;
}

.resumo-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.resumo-item span:first-child {
    font-weight: bold;
}

.buttons {
    display: flex;
    justify-content: end;
    margin-top: 20px;
    width: 100%;
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



.buttons button {
    border-radius: 15px;
    color: white;
    padding: 10px;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botaoPrimario {
    border-radius: 15px;
    color: white;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botaoPrimario:hover {
    background-color: var(--cor-branco);
    color: var(--cor-principal);
}


select {
    padding: 5px !important;
    border: 2px solid var(--cor-principal);
    border-radius: 5px;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--cor-branco);
    color: var(--cor-preto);
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
}

select:hover,
select:focus {
    border-color: var(--cor-principal);
    outline: none;
}

select option {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

select option:hover {
    background-color: var(--cor-principal) !important;
    color: white;
}



@media (min-width: 768px) {
    .form-container {
        grid-template-columns: 1fr 1fr;
    }

    .form-group {
        margin-bottom: 0;
    }

    .form-group:nth-child(odd) {
        margin-right: 15px;
    }
}

@media (max-width: 767px) {
    .popup-content {
        width: 95%;
        height: auto;
        overflow-y: auto;
        padding: 10px;
    }

    h2 {
        font-size: 1.2rem;
    }

    .compra {
        flex-direction: column;
    }

    .resumo-container {
        margin-top: 20px;
        margin-left: 0;
        max-width: 100% !important;
        width: 100% !important;
    }

    .buttons {
        flex-direction: column;
        gap: 10px;
    }

    .buttons button {
        width: 100%;
    }

}
</style>
