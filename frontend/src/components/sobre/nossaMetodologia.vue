<template>
    <section class="metodologia">
      <h2 class="titulo" data-aos="fade-up">Nossa metodologia</h2>
  
      <!-- Primeira seção -->
      <div class="bloco bloco-invertido" data-aos="fade-right" data-aos-duration="1000">
        <img class="foto" src="@/assets/images/respirando.jpg" alt="Foto Metodologia 1" data-aos="zoom-in" data-aos-duration="1000"/>
        <p class="texto" data-aos="fade-left" data-aos-delay="200">
          Trabalhamos com acompanhamento online, garantindo um atendimento de qualidade
          e com a comodidade de estarmos sempre com você, aonde quer que você esteja.
        </p>
      </div>
  
      <!-- Segunda seção -->
      <div class="bloco" data-aos="fade-left" data-aos-duration="1000">
        <p class="texto" data-aos="fade-right" data-aos-delay="200">
          Nosso tratamento é baseado em evidências científicas e conta com um modelo de
          abordagem elaborado após 13 anos de estudos dedicados ao entendimento do tabagismo
          e das doenças relacionadas ao uso do cigarro, principalmente enfisema pulmonar
          (ou doença pulmonar obstrutiva crônica - DPOC) e insuficiência cardíaca.
        </p>
        <img class="foto" src="@/assets/images/quebrandoCigarro.jpg" alt="Foto Metodologia 2" data-aos="zoom-in" data-aos-duration="1000"/>
      </div>
  
      <!-- Terceira seção -->
      <div class="bloco" data-aos="fade-left" data-aos-duration="1000">
        <p class="texto" data-aos="fade-right" data-aos-delay="200">
          Seguimos um modelo de abordagem internacional, realizado nos grandes centros
          do mundo. Assim, entendemos que o tabagismo não deve ser tratado como um simples vício,
          mas sim como uma doença complexa, que envolve dependências química, psicológica e
          comportamental, e que merece um tratamento completo, incluindo não apenas a
          terapia medicamentosa, mas também terapias que abordem a mudança de comportamento
          e aconselhamento profissional próximo do paciente.
        </p>
        <img class="foto" src="@/assets/images/pessoasFelizes1.jpg" alt="Foto Metodologia 3" data-aos="zoom-in" data-aos-duration="1000"/>
      </div>
  
      <!-- Quarta seção -->
      <div class="bloco" data-aos="fade-left" data-aos-duration="1000">
        <p class="texto" data-aos="fade-right" data-aos-delay="200">
          Ainda, por compreendermos a complexidade da doença, a nossa equipe conta com profissionais
          de áreas distintas, qualificados para ajudar você a viver uma vida livre do cigarro e com
          mais qualidade!
        </p>
        <img class="foto" src="../../assets/images/idosos.jpg" alt="Foto Metodologia 4" data-aos="zoom-in" data-aos-duration="1000"/>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import AOS from 'aos'
  import 'aos/dist/aos.css'
  
  onMounted(() => {
    AOS.init()
  })
  </script>

  <style scoped>
  .metodologia {
    background: white;
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .titulo {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    font-weight: bold;
    color: #1e293b;
  }
  
  .bloco {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3rem;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .bloco-invertido {
    flex-direction: row;
  }
  
  .foto {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }
  
  .texto {
    flex: 1;
    font-size: 1.1rem;
    line-height: 1.7;
    color: #374151;
    max-width: 700px;
  }
  
  /* Responsivo */
  @media (max-width: 768px) {
    .bloco,
    .bloco-invertido {
      flex-direction: column-reverse;
      text-align: center;
    }

    .bloco-invertido {
    flex-direction: column;
  }
  
    .foto {
      width: 200px;
      height: 200px;
    }
  
    .texto {
      font-size: 1rem;
    }
  }
  </style>
  