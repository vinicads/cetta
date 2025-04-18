<template>
    <div class="container">
        <div class="title" data-aos="fade-up">Sobre o CETTA</div>
        <div class="subtitle" data-aos="fade-up" data-aos-delay="200">
            O <b>Centro de Educação e Tratamento do Tabagismo (CETTA)</b> nasceu após mais de uma década de estudos
            dedicados ao entendimento do tabagismo e das doenças pulmonares e cardíacas associadas ao uso do cigarro.
        </div>

        <div class="cards">
            <div class="cardSobre" data-aos="zoom-in" data-aos-delay="300">
                <div class="imagem">
                    <img src="../../assets/icons/metodologia.png" alt="Card Image" />
                </div>
                <div class="texto">
                    <h3>Metodologia</h3>
                    <p>
                        A metodologia do CETTA é baseada em evidências científicas e estruturada em um modelo de
                        tratamento diferenciado, que conta com o componente educacional, para que o tabagista entenda o
                        que é o tabagismo, como ele age no organismo, quais são os tipos de dependência associados ao
                        ato de fumar, quais são as melhores estratégias para parar de fumar, entre outros fatores
                        fundamentais durante o processo da parada.
                    </p>
                </div>
            </div>

            <div class="cardSobre" data-aos="zoom-in" data-aos-delay="500">
                <div class="imagem">
                    <img src="../../assets/icons/estrutura.png" alt="Card Image" />
                </div>
                <div class="texto">
                    <h3>Estrutura</h3>
                    <p>
                        A estrutura do CETTA foi cuidadosamente pensada para aumentar as chances de sucesso da
                        parada, combinando as terapias medicamentosa e cognitivo-comportamental, conectando pessoas que
                        compartilham da mesma experiência em diferentes momentos de vida e aproximando paciente e
                        terapeuta durante esse processo que exige comprometimento, empatia, cuidado e muita dedicação.
                    </p>
                </div>
            </div>
        </div>

        <div class="title" style="margin-top: 2rem; font-size: 1.3rem;" data-aos="fade-up">
            No CETTA, nós entendemos que parar de fumar é difícil, mas também temos a certeza de que é possível.</div>
        <div class="subtitle" data-aos="fade-up" data-aos-delay="200">
            Aqui, nós te mostramos que você pode e você merece viver uma vida livre do
            cigarro!
        </div>

    </div>

    <nossaMetodologia />

    <carrosselProfileTemp />
</template>


<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import carrosselProfileTemp from './carrosselProfileTemp.vue';
import nossaMetodologia from './nossaMetodologia.vue';
export default {
    components: {
        carrosselProfileTemp,
        nossaMetodologia
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
    margin-top: 9rem;
    margin-bottom: 5rem;
    padding: 0 1rem;
}

.title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--cor-preto);
    margin-bottom: 1rem;
}

.subtitle {
    text-align: left;
    font-size: 1.2rem;
    color: var(--cor-preto);
    margin-bottom: 2rem;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
}

.cardSobre {
    display: flex;
    align-items: center;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border-radius: 15px;
    padding: 1.5rem;
    width: 49%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
}

.cardSobre:hover {
    transform: translateY(-5px);
}

.imagem {
    margin-right: 1.5rem;
}

.texto {
    color: var(--cor-branco);
}

.texto h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.texto p {
    font-size: 0.8rem;
    line-height: 1.5;
    color: #f5f5f5;
}

.imagem img {
    width: 150px;
    height: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);

}

.conteudo {
    flex: 1;
    color: var(--cor-branco);
}

.conteudo h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.conteudo p {
    font-size: 1rem;
    line-height: 1.5;
    color: #f5f5f5;
}

.buttons {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.buttons button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.buttons button:hover {
    background: var(--cor-branco);
    color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
}

.videoSection {
    width: 100%;
    margin-top: 3rem;
    text-align: center;
}

.videoSection p {
    margin-top: 1.5rem;
    font-size: 1.1rem;
    color: var(--cor-preto);
}

@media (max-width: 1000px) {
    p {
        text-align: center;
    }

    .cards {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .cardSobre {
        text-align: center;
        width: 100%;
    }

    .imagem {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .imagem img {
        width: 100px;
    }

    .conteudo h3 {
        font-size: 1.3rem;
    }

    .buttons button {
        width: 80%;
    }
}

@media (max-width: 768px) {

    .cardSobre {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .imagem {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .imagem img {
        width: 100px;
    }

    .cardSobre p {
        font-size: 1rem;
    }

}
</style>