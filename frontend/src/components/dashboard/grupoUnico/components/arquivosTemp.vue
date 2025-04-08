<template>
    <div class="p-4 bg-white rounded-xl shadow-md" style="border-radius: 8px;">
        <div class="mb-4 text-sm text-gray-600 flex flex-wrap items-center gap-1">
            <span class="cursor-pointer text-blue-600 hover:underline" @click="voltarParaIndice(-1)"
                style="cursor: pointer;">Inicio</span>
            <template v-for="(pasta, index) in pastas" :key="index">
                <span>/</span>
                <span style="cursor: pointer;" class="cursor-pointer text-blue-600 hover:underline"
                    @click="voltarParaIndice(index)">
                    {{ pasta }}
                </span>
            </template>
        </div>

        <div v-if="arquivos.length === 0" class="text-gray-500 text-sm w-full text-center mt-4">
            Nenhum arquivo ou pasta encontrado.
        </div>

        <div class="flex flex-wrap gap-4 mb-6 gridArquivos" v-if="arquivos.length > 0">
            <div v-for="(item, index) in arquivos" :key="index" class="relative group file-card"
                @click="handleItemClick(item)">
                <div class="icon">
                    <i v-if="item.tipo === 'pasta'" class="fas fa-folder folder-icon"></i>
                    <i v-else-if="isImage(item.nome)" class="fas fa-file-image image-icon"></i>
                    <i v-else-if="isVideo(item.nome)" class="fas fa-file-video video-icon"></i>
                    <i v-else-if="isPDF(item.nome)" class="fas fa-file-pdf pdf-icon"></i>
                    <i v-else class="fas fa-file-alt default-icon"></i>
                </div>
                <p class="text-sm text-gray-700 truncate-text w-full">{{ item.nome }}</p>
                <button class="delete-btn" @click.stop="excluirArquivo(item.nome)" v-if="perfil != 'Usuario'">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <div class="border-t pt-6 mt-6" style="margin-top: 2rem;" v-if="perfil != 'Usuario'">
            <div class="flex flex-col md:flex-row gap-6 items-start">
                <div class="flex-1">
                    <div class="drop-zone" :class="{ 'dragging': isDragging }" @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" @click="triggerFileInput">
                        <input ref="fileInput" type="file" multiple hidden @change="handleFileSelect" />
                        <div class="drop-content">
                            <i class="fas fa-cloud-upload-alt upload-icon"></i>
                            <h2>Arraste e solte seus arquivos aqui</h2>
                            <p class="text-muted">Ou clique para selecionar manualmente</p>
                            <p class="text-mini">Formatos aceitos: imagens, vídeos, PDFs e mais</p>
                        </div>
                    </div>
                </div>

                <div class="self-center" style="display: flex;justify-content: end;">
                    <button class="icon-button" @click="abrirPopupCriarPasta" title="Criar pasta">
                        <i class="fas fa-folder-plus"></i>
                    </button>
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
    <popupCarregamentoTemp v-if="loading" />
    <criarPastaPopup v-if="criarPastaPopup" @close="fecharPopupCriarPasta" @criar="criarPasta" />
</template>

<script>
import store from '@/auth/autenticacao'
import axios from 'axios'
import Mensagem from '../../../alertas/mensagensTemp.vue'
import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
import criarPastaPopup from '../popups/criarPastaPopup.vue'
export default {
    components: {
        Mensagem,
        popupCarregamentoTemp,
        criarPastaPopup
    },
    props: {
        idGrupo: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            perfil: store.state.perfil,
            arquivos: [],
            pastas: [],
            mensagemErro: '',
            mensagemSucesso: '',
            mensagemAlerta: '',
            loading: false,
            criarPastaPopup: false,
            isDragging: false,
        }
    },
    mounted() {
        this.perfil = store.state.perfil
        this.carregarArquivos()
    },
    methods: {
        fecharModal() {
            this.mensagemErro = '';
            this.mensagemAlerta = '';
            this.mensagemSucesso = '';
        },
        async carregarArquivos() {
            this.arquivos = []
            try {
                const caminho = this.pastas.join('/')
                const url = `${store.state.apiUrl}/grupos/arquivos/${this.idGrupo}${caminho ? `?caminho=${caminho}` : ''}`
                const res = await axios.get(url, { withCredentials: true })
                this.arquivos = res.data
            } catch (error) {
                console.error('Erro ao buscar arquivos:', error)
            }
        },
        handleItemClick(item) {
            if (item.tipo === 'pasta') {
                this.pastas.push(item.nome)
                this.carregarArquivos()
            } else {
                this.abrirArquivo(item.nome)
            }
        },
        abrirArquivo(nome) {
            const caminho = [...this.pastas, nome].join('/')
            const url = `${store.state.apiUrl}/public/files/grupos/${this.idGrupo}/${caminho}`
            window.open(url, '_blank')
        },
        async excluirArquivo(nome) {
            this.loading = true;

            const data = {
                "idGrupo": this.idGrupo,
                "nome": nome,
                "caminho": this.pastas
            }

            await axios.post(`${store.state.apiUrl}/grupos/arquivos/apagar`,
                data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.fecharModal()
                    this.mensagemSucesso = "Apagado com sucesso!"
                    this.carregarArquivos()
                })
                .catch((error) => {
                    this.mensagemErro = error.response.data.message ?? 'Algo deu errado.';
                    this.loading = false;
                });
            this.loading = false;
        },
        voltarParaIndice(index) {
            this.pastas = index === -1 ? [] : this.pastas.slice(0, index + 1)
            this.carregarArquivos()
        },
        handleDrop(event) {
            this.isDragging = false
            const files = Array.from(event.dataTransfer.files)
            this.uploadArquivos(files)
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files)
            this.uploadArquivos(files)
        },
        async uploadArquivos(files) {
            if (!files || !Array.isArray(files)) {
                this.mensagemErro = "Nenhum arquivo enviado.";
                return;
            }
            this.loading = true;
            const formData = new FormData()
            files.forEach(file => formData.append('arquivos', file))
            formData.append('idGrupo', String(this.idGrupo));

            if (this.pastas.length > 0) {
                this.pastas.forEach(item => {
                    formData.append('caminho[]', item);
                });
            }

            await axios.post(`${store.state.apiUrl}/grupos/arquivos`,
                formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.fecharModal()
                    this.mensagemSucesso = "Arquivos enviados!"
                    this.carregarArquivos()
                })
                .catch((error) => {

                    this.mensagemErro = error.response.data.message ?? 'Algo deu errado.';
                    this.loading = false;
                });
            this.loading = false;
        },
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        abrirPopupCriarPasta() {
            this.criarPastaPopup = true;
        },
        fecharPopupCriarPasta() {
            this.criarPastaPopup = false;
        },
        async criarPasta(nome) {
            this.loading = true;

            const data = {
                "idGrupo": this.idGrupo,
                "nomePasta": nome,
                "caminho": this.pastas
            }

            await axios.post(`${store.state.apiUrl}/grupos/criarPasta`,
                data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    this.loading = false;
                    this.fecharModal()
                    this.mensagemSucesso = "Pasta criada!"
                    this.carregarArquivos()
                })
                .catch((error) => {
                    this.mensagemErro = error.response.data.message ?? 'Algo deu errado.';
                    this.loading = false;
                });
            this.loading = false;
        },
        isImage(nome) {
            return /\.(jpe?g|png|gif|bmp|webp)$/i.test(nome)
        },
        isVideo(nome) {
            return /\.(mp4|avi|mov|mkv|webm)$/i.test(nome)
        },
        isPDF(nome) {
            return /\.pdf$/i.test(nome)
        },
    },
}
</script>

<style scoped>
.gridArquivos {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.file-card {
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    background-color: #ffffff;
    cursor: pointer;
    width: 210px;
    transition: box-shadow 0.2s ease;
    position: relative;
    transition: 0.3s ease-in-out all;
}

.file-card:hover{
    transform: scale(1.05);
}

.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.folder-icon {
    color: #fbbf24;
}

.image-icon {
    color: var(--cor-principal);
}

.video-icon {
    color: #8b5cf6;
}

.pdf-icon {
    color: #ef4444;
}

.default-icon {
    color: var(--cor-principal);
}

.delete-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: #ef4444;
    border: none;
    color: #fff;
    border-radius: 9999px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.file-card:hover .delete-btn {
    opacity: 1;
}

.drop-zone {
    border: 3px dashed #cbd5e1;
    border-radius: 1rem;
    padding: 3rem 1.5rem;
    background-color: #f9fafb;
    text-align: center;
    transition: background-color 0.3s, border-color 0.3s;
    cursor: pointer;
}

.drop-zone.dragging, .drop-zone:hover {
    background: linear-gradient(to bottom right, #e0f2fe, #bae6fd);
    border-color: #3b82f6;
}

.drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-icon {
    font-size: 2.5rem;
    color: #3b82f6;
    margin-bottom: 0.75rem;
}

.drop-zone h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
}

.text-muted {
    font-size: 0.9rem;
    color: #6b7280;
}

.text-mini {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.3rem;
}

.icon-button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco);
    border: none;
    border-radius: 50%;
    width: 46px;
    height: 46px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease;
}

.icon-button:hover {
    background: var(--cor-secundaria);
}
</style>