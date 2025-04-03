<template>
    <div class="info-card">
        <img 
          src="../../../assets/images/idosos.jpg" 
          alt="Imagem" 
          class="image" 
          data-aos="fade-right" 
          data-aos-duration="1000" />
        <div class="content" data-aos="fade-left" data-aos-duration="1000">
            <h2 class="title">NOSSA METODOLOGIA</h2>
            <p class="description">
                Breve descrição da metodologia do tratamento
            </p>
            <div class="buttons">
                <button @click="$router.push('/sobre')">Saiba mais</button>
            </div>
        </div>
    </div>
</template>
<script>
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  mounted() {
    AOS.init();
  },
};
</script>

<style scoped>
.info-card {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6rem 0;
    border-radius: 20px;
}

.image {
    width: 40%;
    height: auto;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    text-align: center;
}

.title {
    color: var(--cor-principal);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.description {
    color: var(--cor-preto);
    font-size: 1rem;
    margin-bottom: 1rem;
    width: 50%;
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
    color: var(--cor-branco);
    padding: 10px;
    width: 30%;
    cursor: pointer;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    border: 1px solid var(--cor-principal);
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {
    background: transparent;
    color: var(--cor-principal);
}

@media(max-width: 1100px) {
    .description {
        width: 80%;
    }
}

@media(max-width: 845px) {
    .info-card {
        flex-direction: column-reverse;
        gap: 20px;
        padding: 2rem 0;
        width: 95%;
        margin: 0 auto;
    }

    .content {
        width: 100%;
        text-align: center;
    }

    .buttons button{
        width: 100%;
    }

    .description {
        width: 95%;
    }

    .image {
        width: 80%;
        height: auto;
        margin: 0 auto;
    }
}
</style>