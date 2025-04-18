<template>
  <div class="info-section">
      <h2 class="title" data-aos="fade-up" data-aos-duration="1000">O QUE OFERECEMOS</h2>
      <div class="cards-container">
          <div class="card" v-for="(item, index) in cards" :key="index" 
               data-aos="fade-up" 
               :data-aos-delay="index * 200" 
               data-aos-duration="1000">
              <img :src="item.image"  :style="index === 1 ? { objectPosition: 'bottom left', objectFit: 'cover' } : {}" :alt="item.title" class="card-image" />
              <h3 class="card-title">{{ item.title }}</h3>
              <div class="buttons">
                <button @click="$router.push({ path: '/comoFunciona', query: { index: item.index } })">Saiba mais</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import image1 from '@/assets/images/quebrandoCigarro.jpg';
import image2 from '@/assets/images/pratos.jpg';
import image3 from '@/assets/icons/zoom.png';
import { useRouter } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  setup() {
      const router = useRouter();

      const cards = [
          { title: 'Tratamento para parar de fumar', image: image1, index: 0 },
          { title: 'Acompanhamento nutricional', image: image2, index: 1 },
          { title: 'Como usar o ZOOM', image: image3, index: 2 },
      ];

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
  color: var(--cor-branco);
  margin-bottom: 2rem;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.card {
  background-color: transparent;
  padding: 2rem;
  text-align: center;
  width: 45%;
  border: none;
}

.card-image {
  width: 300px;
  height: 300px;
  border-radius:50%;
  margin: 0 auto;
  object-fit: cover;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--cor-branco);
  margin-bottom: 1rem;
}

.buttons button {
    border-radius: 15px;
    border: none;
    color: var(--cor-principal);
    padding: 10px;
    width: 20rem;
    cursor: pointer;
    background-color: var(--cor-branco);
    border: 1px solid var(--cor-branco);
    transition: 0.5s ease-in-out;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {
    background-color: transparent;
    color: var(--cor-branco);
}

@media (max-width: 768px){
    .buttons button{
        width: 100%;
    }
}

@media (max-width: 768px) {
  .cards-container {
      flex-direction: column;
      align-items: center;
  }

  .card{
      width: 100%;
  }
}
</style>