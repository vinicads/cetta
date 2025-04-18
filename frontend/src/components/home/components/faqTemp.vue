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
                    question: "O que significa dizer que o Programa CETTA é “baseado em evidências científicas”?",
                    answer: "As evidências científicas são os estudos publicados em jornais científicos da área em questão (no nosso caso, Pneumologia, Cardiologia, Psiquiatria, Nutrição, e outras áreas afins).\nOs estudos científicos servem para comprovar a eficácia ou até mesmo a ineficácia de medicamentos, métodos de tratamento, entre outras intervenções.\nAssim, dizer que o Programa CETTA é baseado em evidências científicas, significa dizer que a metodologia de tratamento implementada no CETTA aborda apenas os modelos de intervenção que são recomendados pela comunidade científica, ou seja, que passaram pelo crivo acadêmico e tiveram sua eficácia cientificamente comprovada.\nNão realizamos intervenções sem eficácia comprovada.",
                    isOpen: false
                },
                {
                    question: "Por que eu devo escolher o CETTA para parar de fumar?",
                    answer: "Diferente dos outros programas do mercado, o CETTA conta com uma abordagem 100% baseada em evidências científicas, com estrutura de atendimento multiprofissional e tratamento global dos diversos aspectos envolvidos no tabagismo.\nO CETTA não trata o tabagismo como um “simples vício” e não compactua com os estereótipos difundidos acerca desta doença.\nTemos a seriedade e o compromisso com a ética de oferecer um atendimento especializado e diferenciado, que enxerga o paciente como um todo e entende que o tabagismo vai além da dependência química.\nPor esse motivo, nosso tratamento aborda os componentes educacional, medicamentoso, psicológico e comportamental, garantindo um modelo de tratamento completo e com abordagem cientificamente comprovada.",
                    isOpen: false
                },
                {
                    question: "Como obtenho informações sobre as modalidades de atendimento e planos de tratamento?",
                    answer: "Diferente dos outros programas do mercado, o CETTA conta com uma abordagem 100% baseada em evidências científicas, com estrutura de atendimento multiprofissional e tratamento global dos diversos aspectos envolvidos no tabagismo.\nO CETTA não trata o tabagismo como um “simples vício” e não compactua com os estereótipos difundidos acerca desta doença.\nTemos a seriedade e o compromisso com a ética de oferecer um atendimento especializado e diferenciado, que enxerga o paciente como um todo e entende que o tabagismo vai além da dependência química.\nPor esse motivo, nosso tratamento aborda os componentes educacional, medicamentoso, psicológico e comportamental, garantindo um modelo de tratamento completo e com abordagem cientificamente comprovada.",
                    isOpen: false
                },
                {
                    question: "Como funciona o agendamento do meu tratamento?",
                    answer: "Independentemente da modalidade de atendimento escolhida por você (Consultoria Individual, Tratamento Individual ou Tratamento em Grupo), após se cadastrar no nosso site, você terá acesso às datas de agendamento disponíveis de acordo com o atendimento que você procura.\nVocê poderá selecionar as datas e horários que melhor se adequem à sua agenda e iniciar o seu tratamento na data escolhida por você.",
                    isOpen: false
                },
                {
                    question: "Quais são as formas de pagamento disponíveis?",
                    answer: "Aceitamos pagamentos online via Pix, cartão de crédito (parcelado em até 6x) e cartão de débito.\nOs pagamentos são realizados aqui mesmo, na página de compra do nosso site.\nTodas as transações são feitas com segurança, por meio da plataforma MercadoPago, uma das soluções de pagamento online mais seguras e confiáveis do mercado.",
                    isOpen: false
                },
                {
                    question: "Como funciona a Consultoria Individual?",
                    answer: "Tanto com a fisioterapeuta (Dra. Rebeca Nunes), quanto com a nutricionista (Dra. Rúbia Holanda), o objetivo da Consultoria Individual é fornecer atendimento único para pacientes que têm interesse em tirar dúvidas e buscar orientações em relação ao seu processo para parar de fumar.\nA consultoria tem duração de uma hora e é realizada em uma única sessão (consulta).\nCaso seu interesse seja realizar o acompanhamento completo (seis meses) para parar de fumar ou acompanhamento nutricional, deve optar pelas outras modalidades de atendimento (individual ou em grupo).",
                    isOpen: false
                },
                {
                    question: "Como funciona o Programa para parar de fumar na modalidade Individual?",
                    answer: "Nesta modalidade de atendimento, você será acompanhado individualmente (ou seja, apenas você e os profissionais envolvidos) por profissionais qualificados no tratamento do tabagismo, por um período total de seis meses.\nO acompanhamento inclui consulta médica para prescrição dos medicamentos utilizados no tratamento, aulas educacionais sobre o tabagismo, como ele age no seu organismo e quais são as melhores estratégias para parar de fumar e sessões com abordagem cognitivo-comportamental, onde serão abordados os acontecimentos cotidianos relacionados às dificuldades encontradas no processo da parada e estratégias para seguir abstinente.",
                    isOpen: false
                },
                {
                    question: "Como funciona o Programa para parar de fumar na modalidade em Grupo?",
                    answer: "Nesta modalidade de atendimento, você será acompanhado por profissionais qualificados no tratamento do tabagismo em grupos de, no máximo, oito pacientes, por um período total de seis meses.\nOs pacientes envolvidos no grupo são pessoas que estão passando pela mesma fase que você: o processo desafiador de parar de fumar.\nO tratamento em Grupo apresenta a vantagem de gerar interações com outras pessoas, compartilhar experiências e dicas e interagir online com as pessoas do seu grupo.\nO acompanhamento inclui consulta médica para prescrição dos medicamentos utilizados no tratamento, aulas educacionais sobre o tabagismo, como ele age no seu organismo e quais são as melhores estratégias para parar de fumar e sessões com abordagem cognitivo-comportamental, onde serão abordados os acontecimentos cotidianos relacionados às dificuldades encontradas no processo da parada e estratégias para seguir abstinente.",
                    isOpen: false
                },
                {
                    question: "Precisarei parar de fumar assim que iniciar o tratamento?",
                    answer: "Não. Não se preocupe, você não precisará parar de fumar assim que iniciar o tratamento.\nAntes do dia da parada (que, carinhosamente, chamamos de “Dia P”), você passará por, no mínimo, quatro consultas.\nIsso quer dizer que iremos preparar você antes de entrar no processo de abstinência.\nAté o Dia P, você terá aulas sobre o tabagismo, como lidar com as fissuras e síndrome de abstinência, como utilizar a sua medicação e muito mais.\nNo Dia P, você já estará utilizando as medicações do seu tratamento e estará preparado(a) para ter a segurança de passar pelo processo de parada da maneira mais amena possível.\nNós iremos te preparar com uma base sólida, porque essa pode até não ser a sua primeira tentativa, mas queremos que seja a última – nosso foco principal é o seu sucesso no processo de parada.",
                    isOpen: false
                },
                {
                    question: "Haverá uso de medicamentos no tratamento para parar de fumar?",
                    answer: "Sim. O nosso tratamento é baseado em evidências científicas.\nAs evidências mostram que as chances de sucesso para parar de fumar aumentam significativamente quando diversos tipos de terapia são associados (terapia medicamentosa, terapia de reposição de nicotina e abordagens cognitivo-comportamentais).\nA nossa metodologia de tratamento conta com as três formas de terapia associadas, conduzidas por profissionais qualificados, para aumentar as suas chances de sucesso.\nNo entanto, a sua medicação será prescrita pelo médico responsável com base nas suas necessidades individuais, isso significa que você não deve comparar a medicação prescrita para você com a medicação prescrita para outras pessoas que também estejam em tratamento.\nAs medicações serão prescritas com base no seu histórico de saúde, medicamentos em uso, tolerância aos medicamentos, entre outras condições.",
                    isOpen: false
                },
                {
                    question: "Quero realizar apenas o acompanhamento nutricional. É possível?",
                    answer: "Sim. Ao concluir seu cadastro no nosso site, você poderá optar pelo atendimento desejado (nutrição ou cessação do tabagismo) e agendar a sua consulta de acordo com os horários disponíveis.",
                    isOpen: false
                },
                {
                    question: "Ainda tenho dúvidas sobre o atendimento do CETTA. O que devo fazer?",
                    answer: "Caso ainda haja dúvidas sobre o nosso atendimento, modalidades de tratamento, formas de pagamento, agendamentos, entre outros assuntos, entre em contato conosco.\nFicaremos felizes em esclarecer todas as suas dúvidas.\nNossos canais de atendimento são o nosso WhatsApp (11 – 933978575), Instagram (@programacetta) e e-mail (contato@programacetta.com).",
                    isOpen: false
                },
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
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
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
