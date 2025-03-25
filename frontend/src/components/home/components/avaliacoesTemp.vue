<template>
    <div class="avaliacao">
        <div class="imagem"><img src="../../../assets/images/pessoaFeliz.png" alt=""></div>
        <div class="content">
            <div class="title">Veja o que dizem de nós</div>
            <div class="wrapper">
                <ul class="carousel" ref="carousel">
                    <li class="card">
                        <p>"Como empresa de transporte, este site nos ajudou muito a encontrar motoristas qualificados
                            para nossos fretes. Postar os fretes e desbloquear contatos foi simples e rápido.
                            Recomendamos este site para outras empresas!"</p>
                        <div class="info">
                            <img src="../../../assets/images/avaliacoes/empresario2.jpg" alt="">
                            <div class="geral">
                                <h3>Maria Silva</h3>
                                <p>Empresa</p>
                            </div>
                        </div>
                        <div class="nota">
                            <div class="star-rating">
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="card">
                        <p>"Encontrei muitas oportunidades de trabalho através deste site! Foi fácil me cadastrar e logo
                            comecei a receber ofertas de empresas interessadas nos meus serviços como motorista.
                            Recomendo!"</p>
                        <div class="info">
                            <img src="../../../assets/images/avaliacoes/motorista1.jpg" alt="">
                            <div class="geral">
                                <h3>Lucas Oliveira</h3>
                                <p>Motorista</p>
                            </div>
                        </div>
                        <div class="nota">
                            <div class="star-rating">
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="card">
                        <p>"Esta plataforma simplificou muito nosso processo de recrutamento de motoristas. Com as
                            ferramentas de busca disponíveis, encontramos rapidamente os profissionais mais adequados
                            para nossas demandas de transporte. Recomendamos!"</p>
                        <div class="info">
                            <img src="../../../assets/images/avaliacoes/empresario1.jpg" alt="">
                            <div class="geral">
                                <h3>Rafael Costa</h3>
                                <p>Recrutador</p>
                            </div>
                        </div>
                        <div class="nota">
                            <div class="star-rating">
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                                <div class="filled">
                                    ★
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="buttons">
                    <button id="left" class="arrow-btn" @click="scrollCarousel(-firstCardWidth)"><img
                            src="../../../assets/icons/arrow.png" alt=""></button>
                    <button id="right" class="arrow-btn" @click="scrollCarousel(firstCardWidth)"><img
                            src="../../../assets/icons/arrow.png" alt=""></button>
                </div>

            </div>
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
            idnoticias: this.$route.params.id,
            dataNoticia: '',
            currentSlide: 0,
            loading: false,
            loadingRelated: false,
            countRelatedNews: 0,
            semResultado: false,
            noticiasRelacionadas: [],
            carouselChildrens: [],
            firstCardWidth: 0,
            cardPerView: 0,
            isDragging: false,
            isAutoPlay: true,
            startX: 0,
            startScrollLeft: 0,
            timeoutId: null,
            cardsLoaded: false
        };
    },
    mounted() {
        this.initializeCarousel();
    },
    methods: {
        cleanCarousel() {
            this.carouselChildrens = [];
            this.firstCardWidth = 0;
            this.cardPerView = 0;
            this.isDragging = false;
            this.isAutoPlay = true;
            this.startX = 0;
            this.startScrollLeft = 0;
            this.timeoutId = null;
        },
        initializeCarousel() {
            const carousel = this.$refs.carousel;
            this.carouselChildrens = Array.from(carousel.children).map(child => child.outerHTML);
            this.firstCardWidth = carousel.querySelector(".card").offsetWidth;
            this.cardPerView = Math.round(carousel.offsetWidth / this.firstCardWidth);
            this.fixFirefoxScroll();
            carousel.scrollLeft = 0;
        },
        fixFirefoxScroll() {
            const carousel = this.$refs.carousel;
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
        },
        scrollCarousel(offset) {
            const carousel = this.$refs.carousel;
            carousel.scrollLeft += offset;
        },
        dragStart(e) {
            this.isDragging = true;
            const carousel = this.$refs.carousel;
            carousel.classList.add("dragging");
            this.startX = e.pageX;
            this.startScrollLeft = carousel.scrollLeft;
        },
        dragging(e) {
            if (!this.isDragging) return;
            const carousel = this.$refs.carousel;
            carousel.scrollLeft = this.startScrollLeft - (e.pageX - this.startX);
        },
        dragStop() {
            this.isDragging = false;
            const carousel = this.$refs.carousel;
            carousel.classList.remove("dragging");
        },
        infiniteScroll() {
            const carousel = this.$refs.carousel;
            if (carousel.scrollLeft === 0) {
                carousel.classList.add("no-transition");
                carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
                carousel.classList.remove("no-transition");
            } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
                carousel.classList.add("no-transition");
                carousel.scrollLeft = carousel.offsetWidth;
                carousel.classList.remove("no-transition");
            }
            clearTimeout(this.timeoutId);
            if (!this.$el.matches(":hover")) this.autoPlay();
        },
        autoPlay() {
            if (window.innerWidth < 800 || !this.isAutoPlay) return;
            this.timeoutId = setTimeout(() => this.scrollCarousel(this.firstCardWidth), 2500);
        },
    },
};
</script>

<style scoped>
.avaliacao {
    width: 100%;
    height: 40rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avaliacao .imagem {
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: end;
    overflow: hidden;
}

.imagem img {
    width: 100%;
    height: 100%;
    background-position: start;
    object-fit: cover;
}

.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 60%;
    justify-content: space-evenly;
    overflow: hidden;
}

.title {
    color: var(--cor-branco);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.wrapper {
    margin: 0 auto;
    width: 100%;
    position: relative;
}

.buttons {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.buttons button {
    background-color: transparent;
    border: none;
}

.buttons button:hover {
    transform: scale(1.2);
}

.buttons button img {
    filter: invert(100%);
    width: 30px;
}

.buttons button:last-child img {
    transform: rotate(180deg);
}

.wrapper .carousel {
    display: grid;
    grid-auto-flow: column;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    width: 100%;
    border-radius: 8px;
    scroll-behavior: smooth;
    scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
    display: none;
}

.carousel.no-transition {
    scroll-behavior: auto;
}

.carousel.dragging {
    scroll-snap-type: none;
    scroll-behavior: auto;
}

.carousel.dragging .card {
    cursor: grab;
    user-select: none;
}

.carousel :where(.card, .img) {
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    border: 1px solid #ccc;
    border-radius: 15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: start;
    scroll-snap-align: start;
    width: 30vw;
    list-style: none;
    cursor: pointer;
    padding-bottom: 15px;
    flex-direction: column;
    border-radius: 8px;
    padding: 5%;
}

.card p {
    height: 60%;
    overflow-y: auto;
    margin: 0;
    font-weight: bold;
}

.card .info {
    margin-top: 2%;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 10px;
}

.card .info img {
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 50%;

}

.card .info .geral {
    width: 80%;
}

.card .info .geral h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
}

.card .info .geral p {
    font-size: 1rem;
}

.nota {
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
}

.star-rating {
    font-size: 1.4rem;
    position: relative;
    margin: 0;
    display: flex;
    justify-content: end;
}

.star-rating div {
    display: inline-block;
    transition: color 0.3s;
}


.star-rating div.filled {
    color: var(--cor-principal);
}

@media(max-width: 1024px) {
    .avaliacao .imagem {
        display: none;
    }

    .content {
        width: 95%;
        padding: 1%;
    }

    .card {
        width: 100%;
    }
}

@media(max-width: 768px) {
    .star-rating {
        justify-content: center;
    }
}

@media screen and (max-width: 900px) {
    .wrapper .carousel {
        grid-auto-columns: calc((100% / 2) - 9px);
    }
}

@media screen and (max-width: 600px) {
    .wrapper .carousel {
        grid-auto-columns: 100%;
    }

    .buttons {
        display: none;
    }
}
</style>
