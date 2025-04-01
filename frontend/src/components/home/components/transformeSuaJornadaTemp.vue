<template>
    <div class="info-section">
      <h2 class="title" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
        MATERIAL EXCLUSIVO
      </h2>
      <div class="cards-container">
        <div 
          class="card" 
          v-for="(item, index) in cards" 
          :key="index" 
          data-aos="flip-left" 
          :data-aos-delay="index * 300" 
          data-aos-duration="1000"
          data-aos-easing="ease-in-out-cubic"
        >
          <img :src="item.image" :alt="item.title" class="card-image" />
          <h3 class="card-title">{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import image1 from '@/assets/images/noteboook.jpg';
  import image2 from '@/assets/images/panfleto.jpg';
  import { useRouter } from 'vue-router';
  import AOS from 'aos';
  import 'aos/dist/aos.css';
  
  export default {
    setup() {
      const router = useRouter();
  
      const cards = [
        {
          title: 'E-book Novos Ares',
          description:
            'Material com todo o conteúdo educativo abordado no tratamento para parar de fumar. O material contém definições de conceitos, dicas de estratégias para controlar as fissuras e para mudanças de comportamento e como utilizar os medicamentos.',
          image: image1
        },
        {
          title: 'Material físico para acompanhamento ativo',
          description:
            'Você receberá material físico na sua casa, contendo listas e outros materiais de acompanhamento ativo, elaborados para auxiliar no seu processo de parada',
          image: image2
        }
      ];
  
      // Initialize AOS
      AOS.init();
  
      return { cards };
    }
  };
  </script>

<style scoped>
.info-section {
    text-align: center;
    padding: 2rem;
}

.title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--cor-principal);
    margin-bottom: 2rem;
}

.cards-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.card {
    padding: 2rem;
    text-align: center;
    width: 45%;
    border: none;
}

.card-image {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--cor-principal);
    margin-bottom: 1rem;
}

.card-button {
    background: var(--cor-principal);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
}

.card-button:hover {
    background: darken(var(--cor-principal), 10%);
}

@media (max-width: 768px) {
    .cards-container {
        flex-direction: column;
        align-items: center;
    }

    .card {
        width: 100%;
    }
}
</style>