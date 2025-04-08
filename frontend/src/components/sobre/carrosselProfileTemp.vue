<template>
    <div class="perfil-container">
        <div class="display">
            <h1 style="margin-block: 1rem; text-align: center;">NOSSA EQUIPE</h1>
            <!-- Seletor de perfis -->
            <div class="perfil-selector">
                <div v-for="(perfil, index) in perfis" :key="index" @click="perfilSelecionado = index"
                    :class="['perfil-btn', { active: perfilSelecionado === index }]">
                    {{ perfil.nome }}
                </div>
            </div>

            <!-- Perfil selecionado -->
            <div class="perfil-info">
                <div class="perfil-imagem">
                    <img :src="perfis[perfilSelecionado].foto" alt="Foto Perfil" />
                </div>
                <div class="perfil-texto">
                    <h2>{{ perfis[perfilSelecionado].titulo }}</h2>
                    <p>{{ perfis[perfilSelecionado].descricao }}</p>
                </div>
            </div>

            <!-- Cards de formação -->
            <div class="cards-grid">
                <div class="card" v-for="(formacao, index) in perfis[perfilSelecionado].formacoes" :key="index">
                    <div class="card-imagens" :class="{ unica: formacao.imagens.length === 1 }">
                        <img v-for="(img, i) in formacao.imagens" :key="i" :src="img" alt="Imagem Formação" />
                    </div>

                    <h4>{{ formacao.titulo }}</h4>
                    <ul>
                        <li v-for="(curso, i) in formacao.cursos" :key="i">
                            {{ curso }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'


import fotoRebeca from '../../assets/images/rebeca.jpg'
import fotoRubia from '../../assets/images/rubia.jpg'
import unesp from '../../assets/icons/unesp.png'
import unimi from '../../assets/icons/unimi.png'
import lundiquist from '../../assets/icons/lundquist.png'
import ufscar from '../../assets/icons/ufscar.png'
import ucla from '../../assets/icons/ucla.png'
import imip from '../../assets/icons/imip.png'
import unifg from '../../assets/icons/unifg.png'
import inades from '../../assets/icons/inades.png'
const perfis = [
    {
        nome: 'Rebeca',
        foto: fotoRebeca,
        titulo: 'Dra. Rebeca Nunes Silva',
        descricao: 'Dos 13 anos da minha carreira como pesquisadora, 7 foram dedicados ao estudo do tabagismo, entendendo como ele age no organismo humano e quais são as melhores estratégias para ajudar as pessoas a pararem de fumar.\nDurante o meu tempo na UNESP, tive o privilégio de ajudar mais de 300 pessoas a pararem de fumar.\nAinda, quando estive na UCLA, tive a honra de visitar um dos maiores e mais importantes centros de tratamento do tabagismo no mundo, que fica no hospital Mayo Clinic, em Minnesota, EUA.\nApós esses 7 anos, dediquei os outros 6 anos da minha carreira ao estudo das doenças pulmonares e cardíacas associadas ao tabagismo, principalmente a doença pulmonar obstrutiva crônica (DPOC, ou enfisema pulmonar) e a insuficiência cardíaca.',
        formacoes: [
            {
                imagens: [unesp],
                cursos: ['Graduanda em Fisioterapia', 'Mestra em Fisioterapia Respiratória', 'Psicopatologia Aplicada']
            },
            {
                imagens: [unimi, lundiquist],
                cursos: ['Mestra em Fisioterapia Respiratória', 'Doutora em Fisioterapia Cardiopulmonar', 'Instituto Lundquist']
            },
            {
                imagens: [ufscar],
                cursos: ['Doutora em Fisioterapia Cardiopulmonar']
            },
            {
                imagens: [ucla],
                cursos: ['Pós-Doutorado em Cardiologia']
            },
        ]
    },
    {
        nome: 'Rúbia',
        foto: fotoRubia,
        titulo: 'Dra. Rúbia Pereira Nunes Holanda de Melo',
        descricao: 'Atuo com foco na promoção da saúde e do bem-estar por meio de uma abordagem nutricional individualizada. Tenho experiência em atendimentos em consultório, oferecendo um acompanhamento próximo, humanizado e baseado nas necessidades específicas de cada paciente.\nBusco constantemente me atualizar, e já concluí cursos nas áreas de gestão do peso, prescrição de micronutrientes e probióticos, interpretação de exames laboratoriais e a relação entre micronutrientes, neurotransmissores, ansiedade e estresse.\nAcredito que a nutrição vai muito além do prato — é ferramenta de cuidado, equilíbrio e qualidade de vida.',
        formacoes: [
            {
                imagens: [unifg],
                cursos: ['Graduanda em Nutrição']
            },
            {
                imagens: [inades],
                cursos: ['Pós-graduanda em Fisioterapia']
            },
            {
                imagens: [imip],
                cursos: ['Pós-graduanda em Nutrição Clínica']
            },
        ]
    },
]

const perfilSelecionado = ref(0)
</script>

<style scoped>
/* Container com fundo radial bonito */
.perfil-container {
    min-height: 100vh;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    padding-block: 2rem;
    color: white;
    font-family: 'Segoe UI', sans-serif;
}

/* Botões dos perfis */
.perfil-selector {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
}

.perfil-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent;
    padding: 10px 20px;
    border-radius: 999px;
    color: white;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
}

.perfil-btn.active,
.perfil-btn:hover {
    background: white;
    color: var(--cor-secundaria);
    border-color: white;
}

/* Info do perfil */
.perfil-info {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
    text-align: center;
}

.perfil-imagem img {
    width: 450px;
    height: 450px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.perfil-texto {
    max-width: 600px;
}

.perfil-texto h2 {
    font-size: 2.2rem;
    margin: 0.5rem 0;
}

.perfil-texto p {
    font-size: 1.1rem;
    opacity: 0.9;
}

/* Título das formações */
.formacoes-titulo {
    font-size: 1.8rem;
    text-align: center;
    margin: 2rem 0 1rem;
}

/* Cards */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    padding-bottom: 4rem;
}

.card {
    background: white;
    color: #1e293b;
    border-radius: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.card-imagens {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.card-imagens img {
    height: 25rem;
    object-fit: contain;
    width: 45%;
}

.card-imagens.unica img {
    width: 100%;
}

.card h4 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
}

.card ul {
    list-style: disc;
    padding-left: 1.2rem;
    text-align: left;
    font-size: 0.95rem;
}

@media (max-width: 768px) {
    .cards-grid {
        display: flex !important;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 95%;
        margin: 0 auto;
    }

    .card {
        width: 100%;
    }


}

/* Responsivo extra */
@media (max-width: 500px) {
    .perfil-imagem img {
        width: 160px;
        height: 160px;
    }

    .perfil-texto h2 {
        font-size: 1.5rem;
    }

    .perfil-texto p {
        font-size: 1rem;
    }
}
</style>