<template>
    <div class="home">
        <div class="contentHome">
            <div data-aos="fade-right">Faça por você!</div>
            <h2 data-aos="zoom-in">viva a vida</h2>
            <h2 class="color" data-aos="zoom-in" data-aos-delay="500">sem cigarro</h2>
            <div class="buttons" data-aos="zoom-in" data-aos-delay="800">
                <button @click="sendToRegister()">Cadastre-se no nosso site</button>
            </div>
        </div>
        <div class="logo">
            <img src="../../../assets/icons/logo.png" alt="" data-aos="flip-up" data-aos-delay="900" />
        </div>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
    mounted() {
        AOS.init(); // Inicializa a biblioteca
    },
    methods: {
        sendToRegister(){
            this.$router.push({ path: '/cadastro'});
        }
    }
};
</script>

<style scoped>

.home {
    width: 100%;
    min-height: 100vh;
    background: url('../../../assets/images/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.contentHome {
    width: 50%;
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
}

.contentHome * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.contentHome div {
    text-align: center;
    color: #fff;
    font-size: 2rem;
    border-radius: 8px;
    background-color: var(--cor-quaternaria);
    padding: 1rem;
    font-weight: bold;
}

.contentHome h2 {
    font-size: 5rem;
    font-weight: bold;
    letter-spacing: 0.3rem;
    color: #fff;
    text-align: center;
}

.color {
    color: var(--cor-quaternaria) !important;
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

.logo img{
    width: 35rem;
    object-fit: contain;
}

.buttons{
    width: auto;
    margin-top: 1rem;
    padding: 0 !important;
    background-color: transparent !important;
}

.buttons button {
    border-radius: 15px;
    border: none;
    color: var(--cor-principal);
    padding: 20px;
    width: 100%;
    cursor: pointer;
    background: var(--cor-branco);
    border: 1px solid var(--cor-branco);
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}


.buttons button:hover {
    background: transparent;
    color: var(--cor-branco);
}

@media (max-width: 1200px) {

    .contentHome div {
        font-size: 2rem;
    }

    .contentHome h2 {
        font-size: 3.5rem;
    }

    .logo img{
        width: 27rem;
    }
}

@media (max-width: 900px) {

    .home{
        flex-direction: column-reverse;
    }

    .contentHome {
        width: 100%;
        align-items: center;
        justify-content: center;
    }
    
    .contentHome div {
        font-size: 2rem;
    }

    .contentHome h2 {
        font-size: 3.5rem;
    }

    .logo img{
        width: 30rem;
    }

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

    .contentHome div {
        font-size: 1.2rem;
    }

    .contentHome h2 {
        font-size: 3rem;
    }

    .logo img{
        width: 25rem;
    }
}


@media (max-width: 350px) {
    .contentHome {
        margin-top: 3rem;
    }

    .contentHome div {
        font-size: 1rem;
    }

    .contentHome h2 {
        font-size: 2.7rem;
    }

    .logo img{
        width: 20rem;
    }
}
</style>
