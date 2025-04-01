<template>
    <div class="container">
        <h2 class="title" data-aos="fade-up">QUEM SOMOS</h2>
        <div class="grid">
            <div
                class="card"
                v-for="(pessoa, index) in pessoas"
                :key="index"
                data-aos="fade-up"
                :data-aos-delay="index * 200"
            >
                <img :src="pessoa.imagem" alt="Imagem" class="image" />
                <h3 class="name">{{ pessoa.nome }}</h3>
                <p class="role">{{ pessoa.titulo }}</p>
                <p class="subtitle">{{ pessoa.subtitulo }}</p>
                <button @click="navigateToSobre">Saiba mais</button>
            </div>
        </div>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import imagem from '../../../assets/images/rebeca.jpg';

export default {
    data() {
        return {
            pessoas: [
                {
                    imagem: imagem,
                    nome: 'Dra. Rebeca Nunes Silva',
                    titulo: 'Fisioterapeuta',
                    subtitulo: 'Doutora em Fisioterapia Cardiopulmonar'
                },
                {
                    imagem: imagem,
                    nome: 'Carlos',
                    titulo: 'Cardiologista',
                    subtitulo: 'Especialista em Saúde Cardiovascular'
                },
                {
                    imagem: imagem,
                    nome: 'Dra. Rúbia Pereira N. H. de Melo',
                    titulo: 'Nutricionista',
                    subtitulo: 'Especialista em Xxxxxxx'
                }
            ]
        };
    },
    mounted() {
        AOS.init({ duration: 1000, once: true });
    },
    methods: {
        navigateToSobre() {
            this.$router.push('/sobre');
        }
    }
};
</script>

<style scoped>
.container {
    width: 100%;
    text-align: center;
    padding: 5rem 0;
}

.title {
    color: var(--cor-branco);
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 40px;
    justify-content: center;
}

.card {
    background-color: transparent;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    border: 0;
}

.image {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px !important;
    margin: 0 auto;
}

.name {
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--cor-branco);
}

.role {
    font-size: 1.2rem;
    color: var(--cor-branco);
    margin: 5px 0;
    opacity: 0.9;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
}

.subtitle {
    font-size: 1rem;
    color: var(--cor-branco);
    margin-bottom: 15px;
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    opacity: 0.7;
}

button {
    border-radius: 15px;
    border: none;
    color: var(--cor-principal);
    padding: 10px;
    width: 100%;
    cursor: pointer;
    background-color: var(--cor-branco);
    border: 1px solid var(--cor-branco);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: transparent;
    color: var(--cor-branco);
}
</style>
