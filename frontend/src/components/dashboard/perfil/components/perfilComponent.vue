<template>
    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
        @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
        @fechar-modal="fecharModal" />
    <div class="containerSmall">
        <popupCarregamentoTemp v-if="loading" />
        <div class="title">Informações pessoais</div>
        <i class="fas fa-edit" @click="modoEdicao = true" v-if="!modoEdicao"></i>
        <div class="info">
            <div class="imagem">
                <img :src="fotoCompleta" v-if="foto != 'semFoto'" alt="">
                <img src="../../../../assets/icons/semFoto.png" v-else alt="">
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
                <div class="overlay" @click="openFileInput">
                    <i class="fas fa-camera"></i>
                </div>
            </div>
            <div class="grid-info">
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Nome</label>
                    <input type="text" class="form-control" :disabled="!modoEdicao" id="nome" v-model="nome"
                        maxlength="45" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="inputAddress">Telefone</label>
                    <input type="text" class="form-control" @input="mascaraTelefoneInput" @paste="colarTelefoneInput"
                        :disabled="!modoEdicao" id="celular" v-model="celular" maxlength="14" required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="data_nasc">Data de nascimento</label>
                    <input type="date" class="form-control" :disabled="!modoEdicao" id="data_nasc" v-model="data_nasc"
                        required>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label for="email">E-mail</label>
                    <input type="email" class="form-control" disabled id="email" v-model="autenticacao.email" required>
                </div>
            </div>
        </div>
        <div class="buttons" v-if="modoEdicao">
            <button class="cancelar" @click="carregarDados(1)">Cancelar</button>
            <button class="atualizar" @click="updateAccount">Atualizar</button>
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
    name: 'perfilComponent',
    data() {
        return {
            apiUrl: store.state.apiUrl,
            autenticacao: store.state.autenticacao,
            perfil: store.state.perfil,
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            modoEdicao: false,
            nome: '',
            data_nasc: '',
            celular: '',
            foto: '',
            fotoCompleta: '',
            loading: false,
        }
    },
    mounted() {
        this.carregarDados(0)
    },
    methods: {
        formatarDataParaInput(dataBD) {
            if (!dataBD) return ""; 

            const data = new Date(dataBD);

            const dataFormatada = data.toISOString().split('T')[0];

            return dataFormatada;
        },
        carregarDados(index) {
            this.modoEdicao = false;
            this.nome = this.autenticacao.conta.nome;
            this.data_nasc = this.formatarDataParaInput(this.autenticacao.conta.data_nasc);
            this.celular = colarCelular(this.autenticacao.conta.celular);

            if (index != 1) {
                this.foto = this.autenticacao.conta.foto;
                this.fotoCompleta = `${this.apiUrl}/public/files/${this.foto}`
            }
        },
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        mascaraTelefoneInput(event) {
            if (this.celular.length == 14) {
                this.celular = colarCelular(this.celular, event)
            } else {
                this.celular = MascaraCelular(this.celular.replace(/\s/g, ''), event);
            }
        },
        colarTelefoneInput(event) {
            var aux = colarCelular(event.clipboardData.getData('text').replace(/\s/g, ''), event);
            this.celular = aux;
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.uploadFile(file);
        },
        async updateAccount() {
            try {
                this.loading = true;
                this.fecharModal()


                let telefone

                if (this.celular) {
                    telefone = RemoveMascaraContato(this.celular)
                }


                const data = {

                    "autenticacao": {
                        "email": this.autenticacao.email,
                    },
                    "conta": {
                        "nome": this.nome,
                        "data_nasc": this.data_nasc,
                        "celular": telefone,
                        "perfil": this.perfil,
                    }
                }
                await axios.put(`${store.state.apiUrl}/users/${this.autenticacao.idAutenticacao}`,
                    data, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(async (response) => {
                        this.loading = false;
                        this.fecharModal()
                        this.mensagemSucesso = "Conta atualizada com sucesso."
                        this.modoEdicao = false;
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
        async uploadFile(file) {
            const formData = new FormData();
            if (!file) {
                this.mensagemAlerta = "Você precisa enviar um arquivo.";
                return;
            }
            formData.append('arquivos', file);
            await axios.put(`${store.state.apiUrl}/users/changePerfil/${this.autenticacao.idConta}`,
                formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(async (response) => {
                    this.fecharModal();
                    this.mensagemSucesso = response.data;
                    const newImageUrl = URL.createObjectURL(file);
                    this.fotoCompleta = newImageUrl;
                })
                .catch((error) => {
                    this.fecharModal();
                    if (error.response.data.message) {
                        this.mensagemErro = error.response.data.message[0];
                    } else {
                        this.mensagemErro = error.response.data;
                    }
                })
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
    text-align: left;
    margin-bottom: 1rem;
    width: 80%;
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
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
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
    gap: 10px;
}

@media (min-width: 768px) {
    .info {
        grid-template-columns: 30% 70%;
    }

    .grid-info {
        grid-template-columns: 1fr 1fr;
    }

    .form-group {
        flex-direction: column;
        align-items: start;
    }

    .form-group label {
        flex: 1;
        text-align: right;
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
    .grid-info {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .info {
        grid-template-columns: 20% 80%;
        align-items: center;
        justify-items: center;
    }

}
</style>
