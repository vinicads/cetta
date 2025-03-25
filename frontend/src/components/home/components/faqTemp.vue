<template>
    <div class="content">
        <div class="faq-container">
            <div class="title">Perguntas Frequentes</div>
            <div class="accordion">
                <div v-for="(item, index) in faqItems" :key="index" class="accordion-item" :class="{ 'isOpen': item.isOpen, 'isClosed': !item.isOpen }">
                    <div @click="toggleAccordion(index)" class="accordion-header">
                        <div class="accordion-question">{{ item.question }}</div>
                        <div class="accordion-icon">
                            <div><img src="../../../assets/icons/arrow.png" alt=""></div>
                        </div>
                    </div>
                    <div  :class="item.isOpen ? 'accordion-content accordion-slide-enter-active' : 'accordion-content accordion-slide-leave-active'">
                        <p>{{ item.answer }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            faqItems: [
                {
                    question: "E se meus fretes acabarem?",
                    answer: "Se seus fretes acabarem, você pode adquirir mais fretes no sistema.",
                    isOpen: false
                },
                {
                    question: "E se eu quiser cancelar a assinatura?",
                    answer: "Se desejar cancelar a assinatura, entre em contato com nossa equipe de suporte. Lembre-se de que não fornecemos reembolso de acordo com nossos termos e condições.",
                    isOpen: false
                },
                {
                    question: "Posso escolher que tipo de motorista quero desbloquear?",
                    answer: "Sim, você pode definir filtros para escolher o tipo de motorista que deseja desbloquear no sistema.",
                    isOpen: false
                },
                {
                    question: "Eu, como motorista, posso cadastrar veículos?",
                    answer: "Sim, você pode cadastrar quantos veículos desejar em sua conta de motorista.",
                    isOpen: false
                },
                {
                    question: "Ao comprar uma assinatura com vários meses, quais são os benefícios?",
                    answer: "Ao comprar uma assinatura com vários meses, você economiza mais, e todo mês você recebe os benefícios que a assinatura oferece.",
                    isOpen: false
                }
            ]
        };
    },
    methods: {
        toggleAccordion(index) {
            this.faqItems.forEach((item, i) => {
                if (i === index) {
                    item.isOpen = !item.isOpen;
                } else {
                    item.isOpen = false;
                }
            });
        }
    }
};
</script>

<style scoped>
.title {
    color: var(--cor-preto);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.faq-container {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.faq-title {
    color: var(--cor-principal);
    font-size: 24px;
    text-align: center;
}

.accordion-item {
    border-radius: 15px;
    margin-bottom: 10px;
}

.accordion-header {
    background-color: var(--cor-principal);
    color: white;
    padding: 15px;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.accordion-header:hover {
    opacity: 0.9;
}

.accordion-icon {
    font-size: 18px;
}

.accordion-icon img{
    width: 20px;
    filter: invert(100%);
    rotate: 270deg;
}

.accordion-content {
    overflow: hidden;
    max-height: 0;
}

.accordion-slide-enter-active {
    animation: accordion-slide-enter 0.3s ease-in-out forwards;
}

.accordion-slide-leave-active {
    animation: accordion-slide-leave 0.3s ease-in-out forwards;
}

@keyframes accordion-slide-enter {
    from {
        max-height: 0;
        opacity: 0;
    }
    to {
        padding: 15px;
        max-height: 1000px;
        opacity: 1;
    }
}

@keyframes accordion-slide-leave {
    from {
        max-height: 1000px;
        padding: 15px;
        opacity: 1;
    }
    to {
        padding: 0px;
        max-height: 0;
        opacity: 0;
    }
}
</style>
