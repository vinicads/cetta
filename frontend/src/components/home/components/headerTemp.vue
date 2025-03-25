<template>
    <div class="home">
        <div class="contentHome">
            <div>Encontrando Fretes</div>
            <p>
                Sempre o melhor frete perto de você
            </p>
        </div>
    </div>
    <div class="grid-info" v-if="!semResultado">
        <div class="cardInfo">
            <h2>{{ qtdeEmpresa }}</h2>
            <p>Empresas</p>
        </div>
        <div class="cardInfo">
            <h2>{{ qtdeContatos }}</h2>
            <p>Motoristas</p>
        </div>
        <div class="cardInfo">
            <h2>{{ qtdeFretes }}</h2>
            <p>Fretes <span class="green">ativos</span></p>
        </div>
    </div>
</template>

<script>
import store from '@/auth/autenticacao.js';
import axios from 'axios';

export default {
    data() {
        return {
            apiUrl: store.state.apiUrl,
            data: [],
            qtdeContatos: 0,
            qtdeEmpresa: 0,
            qtdeFretes: 0,
            semResultado: true,
        };
    },
    mounted() {
        this.getGeral();
    },
    methods: {
        async getGeral() {
            this.semResultado = true;
            try {
                const response = await axios.get(`${store.state.apiUrl}/public/infoGeral`, {
                    withCredentials: true,
                });
                this.data = response.data;
                this.qtdeContatos = this.data.qtdeContatos;
                this.qtdeEmpresa = this.data.qtdeEmpresa;
                this.qtdeFretes = this.data.qtdeFretes;
                this.semResultado = false;
            } catch (error) {
                this.semResultado = true;
            }
        },
    },
};
</script>

<style scoped>
.home {
    width: 100%;
    min-height: 100vh;
    background: url('../../../assets/images/backgroundHome.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.contentHome {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.contentHome * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.contentHome div:first-child {
    text-align: center;
    color: #fff;
    font-size: 5vw;
    font-weight: bold;
}

.contentHome p {
    width: 70%;
    margin: 0 auto;
    font-size: 1.6vw;
    color: #fff;
    text-align: center;
}

.grid-info {
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #fff;
    border: 1px solid var(--cor-preto);
    border-radius: 15px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
    margin: 0 auto;
    padding: 2% 0;
    z-index: 1;
    transform: translateY(-50%); 
}

.cardInfo {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cardInfo p, .cardInfo h2 {
    margin: 0;
    font-weight: bold;
}

.cardInfo h2 {
    font-size: 3em;
}

.cardInfo p {
    font-size: 1.5em;
}

.green {
    color: #41D999;
}

@media (max-width: 900px) {
    .grid-info{
        width: 90%;
    }

    .cardInfo h2{
        font-size: 2rem;
    }

    .cardInfo p{
        font-size: 1rem;
    }
}

@media (max-width: 768px) {
    .contentHome div:first-child {
        font-size: 8vw;
    }

    .contentHome p {
        font-size: 3vw;
    }
}

@media (max-width: 600px) {
    .grid-info{
        width: 98%;
    }

    .cardInfo {
        min-width: 33%;
        width: auto;
    }

    .cardInfo h2{
        font-size: 1.8rem;
    }

    .cardInfo p{
        font-size: 1.2rem;
        text-align: center;
    }
}

@media (max-width: 475px) {
    .contentHome div:first-child {
        font-size: 10vw;
    }

    .contentHome p {
        width: 90%;
        font-size: 5vw;
    }
}

@media (max-height: 350px) {
    .contentHome {
        margin-top: 3rem;
    }
}
</style>
