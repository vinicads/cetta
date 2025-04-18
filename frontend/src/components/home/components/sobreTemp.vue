<template>
    <div class="container">
        <div class="title" data-aos="fade-up">Conheça o CETTA</div>
        <div class="subtitle" data-aos="fade-up" data-aos-delay="200">O Centro de Educação e Tratamento do Tabagismo
            (CETTA) nasceu após mais de uma década de
            estudos dedicados ao entendimento do tabagismo e das doenças pulmonares e cardíacas associadas ao uso do
            cigarro.</div>
        <div class="cards">
            <div class="cardSobre" data-aos="zoom-in" data-aos-delay="300">
                <div class="imagem"><img src="../../../assets/icons/objetivo.png" alt="Card Image"></div>
                <h3>Objetivo</h3>
                <p>Temos o propósito de auxiliar você a viver
                    uma vida com qualidade, livre do cigarro.
                    Consequentemente, combatemos a
                    maior causa evitável de mortes no
                    mundo: o tabagismo. Vamos juntos!</p>
            </div>
            <div class="cardSobre" data-aos="zoom-in" data-aos-delay="500">
                <div class="imagem"><img src="../../../assets/icons/idea.png" alt="Card Image"></div>
                <h3>Diferencial</h3>
                <p>Desenvolvemos um programa focado em
                    entregar soluções com eficácia.
                    Para isso,
                    implementamos
                    um protocolo de
                    atendimento diferenciado, cuidadosamente
                    estruturado para aumentar as suas chances de sucesso!</p>
            </div>
        </div>
        <div class="buttons" data-aos="fade-up" data-aos-delay="400">
            <button @click="saibaMais()">Saiba mais</button>
        </div>
        <div class="cardSobre" style="width: 100%; margin-top: 2rem;" data-aos="fade-up" data-aos-delay="200">
            <videoPlayer></videoPlayer>
            <p style="margin-top: 2rem;">Assista ao vídeo e conheça mais sobre o CETTA!</p>
        </div>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import videoPlayer from '@/components/home/components/videoPlayerTemp.vue';
export default {
    components: {
        videoPlayer,
    },
    mounted() {
        AOS.init();
    },
    methods: {
        saibaMais() {
            this.$router.push('/sobre');
        },
    },
};
</script>

<style scoped>
.container {
    text-align: left;
}

.title {
    color: var(--cor-preto);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: left;
    font-weight: bold;
}

.subtitle {
    color: var(--cor-preto);
    font-size: 1.2rem;
    margin-bottom: 2rem;
    text-align: left;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
}

.cardSobre {
    border-radius: 8px;
    transition: transform 0.3s;
    width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.cardSobre:hover {
    transform: translateY(-5px);
}

.imagem {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    width: 100%;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin-bottom: 5%;
    overflow: hidden;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.cardSobre .imagem img {
    padding: 5%;
    width: 7rem;
    height: auto;
    object-fit: cover;
}

.cardSobre:last-child .imagem img {
    width: 12rem;
    filter: invert(100%);
}

.cardSobre h3 {
    font-size: 1.5rem;
    color: var(--cor-preto);
}

.cardSobre p {
    font-size: 1rem;
    color: #555;
}

.buttons {
    display: flex;
    justify-content: center;
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
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border: 1px solid var(--cor-principal);
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}


.buttons button:hover {
    background: var(--cor-branco);
    color: var(--cor-principal);
}

@media (max-width: 768px){
    .buttons button{
        width: 100%;
    }
}
</style>
