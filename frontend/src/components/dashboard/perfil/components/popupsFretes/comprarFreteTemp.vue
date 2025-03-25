<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Comprar Frete</h2>
            <p>Você não possui mais fretes disponíveis.</p>
            <div class="compra">
                <div class="form-container">
                    <div class="form-group">
                        <label>Preço do Frete</label>
                        <input type="text" v-model="valorFrete" disabled>
                    </div>
                    <div class="form-group">
                        <label>Quantidade de Frete</label>
                        <input type="number" value="1" disabled>
                    </div>
                    <div class="form-group">
                        <label>Informações úteis:</label>
                        <ul>
                            <li>A compra é irreversível.</li>
                            <li>Ao comprar, você concorda com os <router-link to="/politicas">termos e
                                    condições</router-link>.</li>
                            <li>Ao clicar em comprar, vamos redirecioná-lo ao formulário de compras.</li>
                            <li>Quando a compra for confirmada, você receberá o frete.</li>
                        </ul>
                    </div>
                    <div class="form-group">
                        <div>Saldo atual: {{ valorDesconto }}</div>
                        <div class="checkbox-grid">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="usarDesconto" />
                                Usar desconto disponível
                            </label>
                        </div>
                    </div>
                </div>
                <div class="resumo-container">
                    <h3>Resumo da Compra</h3>
                    <div class="resumo-item">
                        <span>Preço do Frete:</span>
                        <span>{{ valorFrete }}</span>
                    </div>
                    <div class="resumo-item">
                        <span>Valor Final:</span>
                        <span>{{ calcularValorFinal }}</span>
                    </div>
                    <div class="buttons">
                        <button @click="comprarFrete" class="botaoPrimario">Comprar</button>
                    </div>
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
    emits: ['close'],
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
            valorFrete: '',
            usarDesconto: false,
            valorDesconto: '',
            loading: false,
        }
    },
    computed: {
        calcularValorFinal() {
            let valorFreteNumerico = parseFloat(this.valorFrete.replace(/[^\d,]/g, '').replace(',', '.'));
            let valorDescontoNumerico = parseFloat(this.valorDesconto.replace(/[^\d,]/g, '').replace(',', '.'));
            if (valorFreteNumerico >= valorDescontoNumerico) {
                if (this.usarDesconto) {
                    let valorFinal = valorFreteNumerico - valorDescontoNumerico;
                    return valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                } else {
                    let valorFinal = valorFreteNumerico;
                    return valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }

            } else {
                if (this.usarDesconto) {
                    let valorFinal = 0;
                    return valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                } else {
                    let valorFinal = valorFreteNumerico;
                    return valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }


            }


        }
    },
    methods: {
        aplicarMascaraValor() {
            let valorNumerico = this.valorFrete.replace(/\D/g, '');
            let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            this.valorFrete = valorFormatado;
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
        removerMascaraValor() {
            let valorNumerico = this.valorFrete.replace(/[^\d,]/g, '');
            this.valorFrete = valorNumerico;
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
        async comprarFrete() {
            this.loading = true;
            const data = {
                "usarDesconto": this.usarDesconto
            };
            await axios.post(`${store.state.apiUrl}/pagamentos/frete`, data, {
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
                    if (error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
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
        async getValorFrete() {
            await axios.get(`${store.state.apiUrl}/public/infoGeral`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.valorFrete = this.aplicarMascaraValorRetorno(response.data.valorFreteIndividual.toString());
                    this.loading = false;
                })
                .catch((error) => {
                    this.semResultado = true;
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.loading = true;
        this.getDesconto();
        this.getValorFrete();
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
    z-index: 1001;
}

.popup-content {
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 5px;
    max-width: 100%;
    max-height: 80vh;
    overflow-y: auto;
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

.compra {
    display: flex;
    justify-content: space-between;
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
