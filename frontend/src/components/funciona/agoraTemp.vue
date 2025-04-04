<template>
    <div class="pagina-cadastro">
      <h1 class="titulo" data-aos="fade-up">Me cadastrei, e agora?</h1>
  
      <div class="cards-container">
        <div class="card" data-aos="fade-up" data-aos-delay="100">
          <h2>1. Cadastro e Acesso aos Grupos</h2>
          <p>
            Ao se cadastrar, você terá acesso à lista de grupos disponíveis, onde poderá visualizar as datas e horários das sessões. Para ingressar em um grupo, é necessário adquirir uma assinatura.
          </p>
        </div>
  
        <div class="card" data-aos="fade-up" data-aos-delay="200">
          <h2>2. Assinatura e Início da Contagem de Tempo</h2>
          <p>
            Se no momento do seu cadastro não houver grupos disponíveis, não se preocupe! A contagem da sua assinatura só começará quando você ingressar no primeiro grupo. Além disso, sempre que novos grupos forem criados, você receberá uma notificação por e-mail para escolher aquele que melhor se encaixa na sua agenda.
          </p>
        </div>
  
        <div class="card" data-aos="fade-up" data-aos-delay="300">
          <h2>3. Sessões Semanais ao Vivo</h2>
          <p>
            Conforme sua assinatura, você terá acesso a sessões semanais realizadas ao vivo via Zoom. Essas sessões são conduzidas diretamente pela minha pessoa, proporcionando um ambiente seguro e interativo para o seu desenvolvimento.
          </p>
        </div>
  
        <div class="card" data-aos="fade-up" data-aos-delay="400">
          <h2>4. Acesso ao Link das Sessões</h2>
          <p>
            Antes de cada sessão, é fundamental acessar o site para obter o link da chamada. O link estará sempre disponível dentro do grupo ao qual você pertence, garantindo que você possa participar sem dificuldades.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AOS from 'aos'
  import 'aos/dist/aos.css'
  
  export default {
    mounted() {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
};

  </script>
  
  <style scoped>
  .pagina-cadastro {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', sans-serif;
  }
  
  .titulo {
    text-align: center;
    font-size: 2.5rem;
    color: var(--cor-principal);
    margin-bottom: 2rem;
  }
  
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .card {
    width: 100%;
    border: 2px solid var(--cor-principal);
    border-radius: 15px;
    padding: 1.5rem;
    background-color: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }
  
  .card h2 {
    font-size: 1.5rem;
    color: var(--cor-principal);
    margin-bottom: 1rem;
  }
  
  .card p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #444;
  }
  
  @media (max-width: 768px) {
    .titulo {
      font-size: 2rem;
    }
  
    .card h2 {
      font-size: 1.25rem;
    }
  
    .card p {
      font-size: 1rem;
    }
  }
  </style>
  