<template>
    <div class="pagina-container">
        <!-- Introdução -->
        <section class="intro-section" data-aos="fade-up">
            <div class="intro-text" data-aos="fade-right">
                <h1 class="titulo">Como funciona?</h1>
                <p class="descricao">
                    Nesta página, você encontrará uma explicação detalhada sobre o funcionamento do sistema e o passo a
                    passo para a realização das sessões.
                </p>
            </div>
            <div class="intro-image" data-aos="fade-left">
                <img src="../../assets/images/men.png" alt="Explicação" />
            </div>
        </section>

        <section class="tratamento-section" v-if="!index || index == 0" data-aos="fade-up">
            <div class="tratamento-image" data-aos="zoom-in">
                <img src="../../assets/images/quebrandoCigarro.jpg" alt="Parar de fumar" />
            </div>
            <div class="tratamento-text" data-aos="fade-left">
                <h2 class="titulo">Tratamento para parar de fumar</h2>
                <p>
                    Que alegria ter você aqui! Saiba que procurar ajuda e aconselhamento profissional é um importante
                    passo para alcançar a cessação do tabagismo!
                </p>
                <p>
                    Para que você entenda um pouco melhor sobre o nosso programa, é importante dizermos que ele foi
                    cuidadosamente estruturado para amenizar as tensões do processo da parada e aumentar as suas chances
                    de sucesso.
                </p>
            </div>
        </section>
    </div>

    <section class="estrutura-section" v-if="!index || index == 0" data-aos="fade-up">
        <div class="display">
            <h2 class="titulo">Estrutura do Programa CETTA</h2>
            <div class="estrutura-grid">
                <div class="estrutura-item destaque" data-aos="fade-left">
                    <h3>Consultoria Individual</h3>
                    <p>
                        Essa modalidade de atendimento é estruturada para pessoas que desejam realizar apenas uma <strong>consulta única
                            com um profissional especialista</strong> no tratamento do tabagismo.
                    </p>
                    <p>
                        Assim, você pode contar com aconselhamento profissional e conversar sobre o que mais for
                        importante para o seu processo de parada.
                    </p>
                </div>

                <div class="estrutura-item" data-aos="fade-right">
                    <p>
                        O nosso programa conta com um total de <strong>22 sessões com profissional
                            especialista</strong>, realizadas ao longo de <strong>6 meses</strong>.
                    </p>
                    <p>
                        Ao participar do nosso programa, você garante:
                    </p>
                    <ul>
                        <li>
                            Participação em todas as 22 sessões (individual ou em grupo, conforme a modalidade
                            escolhida), realizadas via Zoom
                        </li>
                        <li>
                            4 aulas educacionais explicando tudo sobre o tabagismo, tipos de dependências e terapia medicamentosa
                        </li>
                        <li>
                            Consulta médica para prescrição dos medicamentos utilizados no seu tratamento
                        </li>
                        <li>
                            Material exclusivo com e-book, listas e fichas de acompanhamento ativo
                        </li>
                        <li>
                            Interações por grupo de WhatsApp
                        </li>
                    </ul>
                </div>

               
            </div>
        </div>
    </section>

    <agoraTemp />

    <tutorialTemp v-if="!index || index == 2" />
</template>


<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import agoraTemp from './agoraTemp.vue';
import tutorialTemp from './tutorialTemp.vue';
export default {
    data() {
        return {
            index: this.$route.query.index,
        }
    },
    components: {
        agoraTemp,
        tutorialTemp
    },
    mounted() {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
};

</script>

<style scoped>
.pagina-container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
    font-family: 'Segoe UI', sans-serif;
    color: #333;
}

.titulo {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #2b2b2b;
}

.descricao {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
}

/* Seção Intro */
.intro-section {
    margin-top: 4.5rem;
    padding: 2rem;
    padding-bottom: 0;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    background-color: #F1F1F1;
    align-items: center;
    gap: 2rem;
}

.intro-text {
    flex: 1;
    min-width: 280px;
}

.intro-image {
    flex: 1;
    display: flex;
    justify-content: center;
}

.intro-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 1rem;
}

/* Tratamento */
.tratamento-section {
    display: flex;
    flex-wrap: wrap-reverse;
    align-items: center;
    gap: 2rem;
}

.tratamento-text {
    flex: 1;
    min-width: 280px;
}

.tratamento-text p {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #444;
}

.tratamento-image {
    flex: 1;
    display: flex;
    justify-content: center;
}

.tratamento-image img {
    border-radius: 50% !important;
    width: 25rem;
    height: 25rem;
    object-fit: cover;
    border-radius: 1rem;
}

/* Estrutura */
.estrutura-section {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    padding: 3rem 2rem;
    width: 100%;
}

.estrutura-section h2 {
    color: #fff;
    text-align: center;
    margin-bottom: 2rem;
}

.estrutura-grid {
    display: grid;
    gap: 2rem;
    width: 100%;
    margin-top: 2rem;
}

.estrutura-item {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.estrutura-item ul {
    padding-left: 1.5rem;
    margin-top: 1rem;
}

.estrutura-item li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
}

.estrutura-item.destaque {
    border-left: 6px solid var(--cor-quaternaria);
    background: #f9fdf9;
}

@media (min-width: 768px) {
    .estrutura-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 768px) {
    .intro-section {
        flex-direction: column;
        text-align: center;
    }

    .estrutura-section {
        padding: 0;
        padding-block: 2rem;
    }

    .estrutura-grid {
        display: flex;
        flex-direction: column;
        width: 95%;
        margin: 0 auto;
    }

    .estrutura-item {
        width: 100%;
    }
}
</style>
