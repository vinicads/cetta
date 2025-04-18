<template>
    <div class="popup-container" @click="closePopupOnOverlay" v-if="showEditarPlanosPopup">
        <div class="popup-content">
            <div class="loading" v-if="loading">
                <div class="loading-screen">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Informações do Plano</h2>
            <div class="form-container">
                <div class="form-group">

                    <label for="modelo">Nome</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarPlano" id="nome" v-model="nome"
                        maxlength="45" required>
                </div>
                <div class="form-group">
                    <label for="placa">Subtítulo</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarPlano" id="subtitulo" maxlength="100"
                        v-model="subtitulo" required>
                </div>
                <div class="form-group">
                    <label for="placa">Descrição</label>
                    <input type="text" class="form-control" @keyup.enter="cadastrarPlano" id="descricao" maxlength="255"
                        v-model="descricao" required>
                </div>
                <div class="form-group">
                    <label for="ano">Valor total</label>
                    <input type="text" class="form-control" id="valorTotal" @keyup.enter="cadastrarPlano"
                        v-model="valorTotal" @focus="removerMascaraValor" @blur="aplicarMascaraValor" required>
                </div>
                <div class="form-group">
                    <label for="qtdePessoas">Quantidade máxima de pessoas</label>
                    <input type="number" min="1" class="form-control" id="qtdePessoas" @keyup.enter="cadastrarPlano"
                        v-model="qtdePessoas" required>
                </div>
                <div class="form-group">
                    <label for="maxSessoes">Quantidade de sessões semanais</label>
                    <input type="number" min="1" class="form-control" id="maxSessoes" @keyup.enter="cadastrarPlano"
                        v-model="maxSessoes" required>
                </div>
                <div class="form-group">
                    <label for="meses">Quantidade de meses</label>
                    <input type="number" min="1" class="form-control" id="meses" @keyup.enter="cadastrarPlano"
                        v-model="meses" required>
                </div>
                <div class="form-group">

                    <label for="tipoFuncionalidade">Tipo de Funcionalidade</label>
                    <select id="tipoFuncionalidade" class="form-control" v-model="tipoFuncionalidade" required>
                        <option class="select-option" value="Nutricao">Nutrição</option>
                        <option class="select-option" value="Tabaquismo">Tabagismo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo</label>
                    <select id="tipo" class="form-control" v-model="tipo" required>
                        <option class="select-option" value="Individual">Individual</option>
                        <option class="select-option" value="Grupo">Grupo</option>
                        <option class="select-option" value="Mentoria">Mentoria</option>
                    </select>
                </div>
            </div>
            <div class="buttons">
                <button @click="closePopup">Cancelar</button>
                <button @click="atualizarPlano">Atualizar</button>
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
    components: {
        Mensagem,
        popupCarregamentoTemp
    },
    data() {
        return {
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            nome: '',
            subtitulo: '',
            descricao: '',
            tipoFuncionalidade: '',
            qtdePessoas: '',
            meses: '',
            maxSessoes: '',
            tipo: '',
            valorTotal: '',
            loading: false,
        }
    },
    props: {
        data: Object,
        showEditarPlanosPopup: Boolean
    },
    methods: {
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
        aplicarMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,.-]/g, '');
            valorNumerico = valorNumerico.replace(',', '.');
            let valorFloat = parseFloat(valorNumerico);

            let valorFormatado = valorFloat.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            return valorFormatado;
        },
        removerMascaraValor() {
            let valorNumerico = this.valorTotal.replace(/[^\d,]/g, '');

            this.valorTotal = valorNumerico;
        },
        removerMascaraValorRetorno(valor) {
            let valorNumerico = valor.replace(/[^\d,]/g, '').replace(',', '.');

            return valorNumerico;
        },
        carregarDados() {
            if (this.data) {
                this.nome = this.data.nome;
                this.subtitulo = this.data.subtitulo;
                this.descricao = this.data.descricao;
                this.tipoFuncionalidade = this.data.tipoFuncionalidade;
                this.tipo = this.data.tipo;
                this.qtdePessoas = this.data.qtdePessoas;
                this.meses = this.data.meses;
                this.maxSessoes = this.data.maxSessoes;
                this.valorTotal = this.aplicarMascaraValorRetorno(this.data.valorTotal.toString());
            }
        },
        atualizarPlano() {
            this.loading = true;

            if (this.maxSessoes < 1) {
                this.mensagemAlerta = 'A quantidade de sessões semanais deve ser maior que 0.';
                this.loading = false;
                return;
            }
            if (this.qtdePessoas < 1) {
                this.mensagemAlerta = 'A quantidade máxima de pessoas deve ser maior que 0.';
                this.loading = false;
                return;
            }
            if (this.meses < 1) {
                this.mensagemAlerta = 'A quantidade de meses deve ser maior que 0.';
                this.loading = false;
                return;
            }

            let valor = ''

            if (this.valorTotal) {
                valor = this.removerMascaraValorRetorno(this.valorTotal)
            }
            const data = {
                "planos": {
                      "nome": this.nome,
                    "subtitulo": this.subtitulo,
                    "descricao": this.descricao,
                    "tipoFuncionalidade": this.tipoFuncionalidade,
                    "tipo": this.tipo,
                    "qtdePessoas": this.qtdePessoas,
                    "meses": this.meses,
                    "maxSessoes": this.maxSessoes,
                    "valorTotal": Number(valor)
                }
            }

            axios.put(`${store.state.apiUrl}/planos/${this.data.idPlanos}`, data, {
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
        this.carregarDados()
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
