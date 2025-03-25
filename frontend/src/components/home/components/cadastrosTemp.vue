<template>
    <div class="container">
        <div class="title">Cadastre-se</div>
    </div>
    <div class="main-login">
        <div class="grid-container">
            <div class="card reverse">
                <img src="../../../assets/images/empresario.jpg" alt="">
                <div class="textos">
                    <div class="title">Para Empresas</div>
                    <router-link to="/cadastro/empresa"><button>Se cadastre!</button></router-link>
                </div>

            </div>
            <div class="card">
                <img src="../../../assets/images/motorista.jpg" alt="">
                <div class="textos">
                    <div class="title">Para Motoristas</div>
                    <router-link to="/cadastro/motorista"><button>Se cadastre!</button></router-link>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import { ref } from 'vue';

</script>

<style scoped>
.title {
    color: var(--cor-preto);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.main-login {
    display: flex;
    justify-content: center;
    align-items: center;
}

.grid-container {
    height: 70%;
    margin: 0 auto;
    width: 70%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.card {
    position: relative;
    overflow: hidden;
    height: 35rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    padding: 10% 5%;
    border: none;
    border-radius: 10px;

}

.card .textos {
    z-index: 2;
    text-align: center;
    background: var(--cor-preto);
    padding: 2%;
    border-radius: 15px;
}

.card img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    z-index: 1;
}

.card .title {
    font-size: 3rem;
    color: var(--cor-branco);
    z-index: 1;
}

.card button {
    font-size: 1rem;
    background: none;
    color: var(--cor-branco);
    border-radius: 15px;
    padding: 1% 2%;
    border: 1px solid var(--cor-branco);
    transition: 0.5s ease-in-out;
    z-index: 1;
}

.card button:hover {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

@media (max-width: 1310px) {
    .card .title {
        font-size: 2rem;
    }

    .grid-container {
    height: 80%;
    margin: 0 auto;
    width: 90%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 20px;
}
}

@media (max-width: 768px) {
    .grid-container {
    width: 95%;
    grid-template-columns: repeat(1, 1fr);
}

}
</style>