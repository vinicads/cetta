<template>
    <div class="popup-overlay">
        <div class="popup-container">
            <div class="popup-header">
                <h2>Detalhes do Usuário</h2>
                <button @click="$emit('close')">✖</button>
            </div>

            <div class="user-info">
                <img v-if="!usuario.foto || usuario.foto === 'semFoto'" src="@/assets/icons/semFoto.png" alt="Sem foto"
                    class="user-photo" />
                <img v-else :src="`${apiUrl}/public/files/${usuario.foto}`" alt="Foto do usuário" class="user-photo" />
                <div class="user-text">
                    <h3>{{ usuario.nome }}</h3>
                    <p><strong>Data de Nascimento:</strong> {{ formatarData(usuario.data_nasc) }}</p>
                    <p><strong>Idade:</strong> {{ calcularIdade(usuario.data_nasc) }}</p>
                    <p><strong>Celular:</strong> {{ usuario.celular }}</p>
                    <p><strong>Perfil:</strong> {{ usuario.perfil }}</p>
                    <p><strong>Email:</strong> {{ usuario.autenticacao[0]?.email }}</p>
                </div>
            </div>

            <div class="section">
                <h4>Assinaturas Ativas</h4>
                <div class="card-grid">
                    <div v-for="assinatura in usuario.assinaturas" :key="assinatura.idAssinatura" class="card">
                        <p><strong>Plano:</strong> {{ assinatura.planos.nome }}</p>
                        <p><strong>Início:</strong> {{ formatarData(assinatura.data_inicio) }}</p>
                        <p><strong>Última Atualização:</strong> {{ formatarData(assinatura.ultimo_update) || '-' }}</p>
                        <p><strong>Ativo:</strong> {{ assinatura.ativo ? 'Sim' : 'Não' }}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h4>Histórico de Pagamentos</h4>
                <div class="card-grid">
                    <div v-for="item in usuario.historico" :key="item.idHistoricoPagamento" class="card">
                        <p><strong>Serviço:</strong> {{ item.nome }}</p>
                        <p><strong>Descrição:</strong> {{ item.descricao }}</p>
                        <p><strong>Valor:</strong> R$ {{ item.valorTotal.toFixed(2) }}</p>
                        <p><strong>Data:</strong> {{ formatarData(item.data_inicio) }}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h4>Questionário Fagerström</h4>
                <ul class="questionario">
                    <li>Em quanto tempo depois de acordar você fuma o primeiro cigarro? <br>{{
                        usuario.questionario.questao1 }}</li>
                    <li>Você acha difícil ficar sem fumar em locais onde é proibido? <br> {{
                        usuario.questionario.questao2 }}</li>
                    <li>Qual o cigarro do dia que lhe traz mais satisfação? <br> {{ usuario.questionario.questao3 }}
                    </li>
                    <li>Quantos cigarros você fuma por dia? (Lembre-se que um maço contém 20 cigarros) <br> {{
                        usuario.questionario.questao4 }}</li>
                    <li>Você fuma mais frequentemente pela manhã? <br> {{ usuario.questionario.questao5 }}</li>
                    <li>Você fuma mesmo doente, quando precisa ficar de cama a maior parte do tempo? <br> {{
                        usuario.questionario.questao6 }}</li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
import store from '@/auth/autenticacao'

export default {
    props: {
        usuario: Object
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
        }
    },
    methods: {
        formatarData(data) {
            if (!data) return null;
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formatarCaminho(caminho) {
            return caminho ? caminho.replace(/\\/g, '/') : '';
        },
        calcularIdade(dataNascimento) {
            const hoje = new Date();
            const nascimento = new Date(dataNascimento);

            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();

            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }

            return idade;
        }
    }
}
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-container {
    background: white;
    width: 95%;
    max-width: 800px;
    padding: 24px;
    border-radius: 16px;
    overflow-y: auto;
    max-height: 90vh;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.popup-header h2 {
    margin: 0;
    font-size: 1.4rem;
}

.popup-header button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
    margin-top: 20px;
    gap: 20px;
    flex-wrap: wrap;
}

.user-photo {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 50%;
}

.user-text h3 {
    margin: 0;
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.section {
    margin-top: 24px;
}

.section h4 {
    margin-bottom: 12px;
    font-size: 1.1rem;
    color: var(--cor-principal);
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.card {
    background: #f3f4f6;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

.questionario {
    list-style: decimal;
    margin-left: 18px;
    padding-left: 4px;
    color: #111827;
}

.questionario li {
    margin-bottom: 1rem;
}

.footer {
    margin-top: 24px;
    text-align: center;
}

.footer button {
    background: #3b82f6;
    color: white;
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

@media (max-width: 768px){
    .user-info{
        align-items: center;
        justify-content: center;
        width: 100%;
    }
}
</style>