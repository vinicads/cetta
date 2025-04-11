<template>
    <div class="popup-container" @click="closePopupOnOverlay">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Cadastro de Grupos</h2>
            <div class="form-container">
                <div class="form-group">
                    <label for="modelo">Plano</label>
                    <select id="plano" class="form-control" @change="findPlano()" v-model="idPlanos" required>
                        <option disabled value="">Selecione um plano</option>
                        <option v-for="plano in planos" :key="plano.idPlanos" :value="plano.idPlanos">
                            {{ plano.nome }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dataInicio">Data de início</label>
                    <input type="date" class="form-control" id="dataInicio" v-model="dataInicio" required>
                </div>
                <div class="form-group">
                    <label for="link">Link da reunião - Opcional</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarGrupo" id="link" maxlength="255"
                        v-model="link" required>
                </div>
            </div>
            <div class="container" v-if="maxHorarios">
                <label class="titulo">Adicionar Horários</label>

                <div v-for="(item, index) in horarios" :key="index" class="card-horario">
                    <select v-model="item.dia" class="select-dia">
                        <option disabled value="">Selecione o dia</option>
                        <option v-for="dia in diasSemana" :key="dia.value" :value="dia.value"
                            :disabled="diaJaSelecionado(dia.value) && dia.value !== item.dia">
                            {{ dia.label }}
                        </option>
                    </select>

                    <input type="time" v-model="item.hora" class="input-hora" />

                    <button @click="removerHorario(index)" class="btn-remover" title="Remover horário">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" stroke="currentColor"
                            fill="none">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div v-if="horarios.length < maxHorarios" style="width: 100%;" class="buttons">
                    <button @click="adicionarHorario" :disabled="horarios.length >= maxHorarios" style="width: 15rem;">
                        + Adicionar Horário
                    </button>
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">Cancelar</button>
                <button @click="cadastrarGrupo">Cadastrar</button>
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

export default {
    emits: ['close'],
    props: {
        showCadastroPlanosPopup: Boolean
    },
    components: {
        Mensagem,
        popupCarregamentoTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            maxHorarios: null,
            diasSemana: [
                { label: 'Segunda', value: 'Segunda' },
                { label: 'Terça', value: 'Terca' },
                { label: 'Quarta', value: 'Quarta' },
                { label: 'Quinta', value: 'Quinta' },
                { label: 'Sexta', value: 'Sexta' },
                { label: 'Sábado', value: 'Sabado' },
                { label: 'Domingo', value: 'Domingo' }
            ],
            horarios: [],
            link: '',
            dataInicio: '',
            idPlanos: '',
            planos: [],
            loading: false,
        }
    },
    methods: {
        adicionarHorario() {
            if (this.horarios.length < this.maxHorarios) {
                this.horarios.push({ dia: '', hora: '' })
            }
        },
        removerHorario(index) {
            this.horarios.splice(index, 1)
        },
        findPlano() {
            const plano = this.planos.find(plano => Number(plano.idPlanos) === Number(this.idPlanos));
            this.maxHorarios = plano.maxSessoes;
        },
        diaJaSelecionado(dia) {
            return this.horarios.some(h => h.dia === dia)
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        aplicarMascaraValor() {
            let valorNumerico = this.valorTotal.replace(/\D/g, '');


            let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            this.valorTotal = valorFormatado;
        },
        removerMascaraValor() {
            let valorNumerico = this.valorTotal.replace(/[^\d,]/g, '');

            this.valorTotal = valorNumerico;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '').replace(',', '.');

            return valorNumerico;
        },
        cadastrarGrupo() {
            this.loading = true;

            if (!this.idPlanos) {
                this.mensagemAlerta = `Primeiro, você deve selecionar um plano.`
                this.loading = false;
                return;
            }

            if (this.horarios.length != this.maxHorarios) {
                this.mensagemAlerta = `Primeiro, você deve adicionar ${this.maxHorarios} horários.`
                this.loading = false;
                return;
            }
            const data = {
                "grupo": {
                    "dataInicio": this.dataInicio,
                    "idPlanos": this.idPlanos,
                    "link": this.link,
                },
                "datas": this.horarios
            }

            axios.post(`${store.state.apiUrl}/grupos`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.mensagemSucesso = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal()
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
        async getPlanos() {
            await axios.get(`${store.state.apiUrl}/public/planos`, {
                withCredentials: true,
            })
                .then((response) => {
                    this.planos = response.data;
                })
                .catch((error) => {
                    this.planos = [];
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
    },
    mounted() {
        this.getPlanos();
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
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 95%;
    max-width: 600px;
    text-align: left;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    color: var(--cor-preto);
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--cor-texto);
}

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55, 55, 55, 0.39);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
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

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    height: 80%;
}

.form-group label {
    margin-bottom: 5px;
}

.form-group input,
.form-group select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    transition: 0.5s ease-in-out;
}

.form-group select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    cursor: pointer;
}

.form-group select .select-option {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

.select-option:hover {
    background-color: var(--cor-principal) !important;
}

.buttons {
    display: flex;
    justify-content: end;
    margin-top: 20px;
    width: 100%;
    gap: 1%;
}

.buttons button {
    border-radius: 15px;
    border: none;
    color: white;
    padding: 10px;
    width: 20%;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:last-of-type {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border: 1px solid var(--cor-principal);
}

.buttons button:last-of-type:hover {
    background: var(--cor-branco);
    color: var(--cor-principal);
}

.buttons button:first-of-type {
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
}

.buttons button:first-of-type:hover {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

.container {
    margin-top: 1rem;
}

.titulo {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
}

.card-horario {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

@media (min-width: 640px) {
    .card-horario {
        grid-template-columns: 1fr 1fr auto;
    }
}

.select-dia,
.input-hora {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    min-width: 0;
}

.btn-remover {
    background: transparent;
    border: none;
    color: #e53935;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0.5rem;
    align-self: flex-start;
}

.icon {
    width: 24px;
    height: 24px;
}

.btn-wrapper {
    margin-top: 1rem;
}

.btn-adicionar {
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 1.25rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-adicionar:hover {
    background-color: #1e40af;
}

.btn-adicionar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

    .buttons {
        flex-direction: column;
        gap: 10px;
    }

    .buttons button {
        width: 100%;
    }
}
</style>
