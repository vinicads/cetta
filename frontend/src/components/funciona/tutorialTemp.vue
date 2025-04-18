<template>
    <div class="pagina-tutorial">
        <div class="display">
            <h1 class="titulo" data-aos="fade-up">Guia para acessar as reuniões pela plataforma Zoom</h1>
            <p class="descricao" data-aos="fade-up" data-aos-delay="100">
                Olá! Preparamos este guia para te ajudar a acessar as sessões online do nosso programa com facilidade.
                Siga os passos para participar das reuniões pela plataforma Zoom. 😊
            </p>

            <div class="container">
                <!-- Barra lateral com texto girado -->
                <div class="barra-lateral">
                    <span class="texto-lateral">É Simples!</span>
                </div>

                <!-- Imagem à direita -->
                <div class="imagem-container" data-aos="fade-left" data-aos-delay="200">
                    <img src="../../assets/images/women.png" alt="Zoom Meeting" />
                </div>
            </div>
        </div>
        <!-- Linha divisória -->
        <div class="linha-divisoria"></div>
        <div class="display">
            <!-- Conteúdo em Grid -->
            <div class="conteudo-grid">
                <div class="grid-item" data-aos="fade-up">
                    <h2 class="subtitulo">1. O que você precisa para acessar?</h2>
                    <ul>
                        <li>Um celular, computador ou tablet com acesso à internet.</li>
                        <li>O link da reunião (que você pegará diretamente no site).</li>
                    </ul>
                </div>

                <div class="grid-item" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="subtitulo">2. Acessando a reunião no Computador</h2>
                    <ul>
                        <li>Acesse o link da reunião.</li>
                        <li>Uma nova janela será aberta.</li>
                        <li>Clique em "Abrir Zoom Meetings" ou "Entrar pelo navegador".</li>
                        <li>Digite seu nome e clique em "Entrar".</li>
                        <li>Clique em "Entrar com vídeo" para ativar sua câmera.</li>
                        <li>Verifique se o microfone está ligado.</li>
                    </ul>
                </div>

                <div class="grid-item" data-aos="fade-up" data-aos-delay="200">
                    <h2 class="subtitulo">3. Acessando no Celular ou Tablet</h2>
                    <ul>
                        <li>Acesse o link da reunião.</li>
                        <li>Instale o aplicativo Zoom, se necessário.</li>
                        <li>Após instalar, volte ao link e clique novamente para entrar.</li>
                        <li>Digite seu nome e clique em "Entrar".</li>
                        <li>Clique em "Entrar com vídeo" e "Conectar ao áudio".</li>
                    </ul>
                </div>

                <div class="grid-item" data-aos="fade-up" data-aos-delay="300">
                    <h2 class="subtitulo">4. Dicas para uma boa experiência</h2>
                    <ul>
                        <li>Use fones de ouvido para melhorar o som.</li>
                        <li>Encontre um ambiente silencioso para se concentrar melhor.</li>
                        <li>Entre com 5 minutos de antecedência para garantir que tudo esteja funcionando.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AOS from 'aos'
import 'aos/dist/aos.css'
import { onMounted } from 'vue'
onMounted(() => {
    AOS.init({
        duration: 800,
        once: true,
    })
})
</script>

<style scoped>
/* Fundo radial */
.pagina-tutorial {
    min-height: 100vh;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    padding-inline: 0;
    font-family: 'Segoe UI', sans-serif;
}

/* Título e descrição */
.titulo {
    font-size: 2.5rem;
    color: var(--cor-terciaria);
    text-align: center;
    margin-bottom: 1rem;
}

.descricao {
    font-size: 1.2rem;
    color: var(--cor-branco);
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

/* Container principal */
.container {
    display: flex;
    align-items: end;
    justify-content: space-between;
    width: 100%;
}

/* Barra lateral com texto girado */
.barra-lateral {
    background: var(--cor-terciaria);
    height: 500px;
    width: 20%;
    display: flex;
    align-items: center;
    margin-top: 3rem;
    justify-content: center;
    transform: rotate(180deg);
}

.texto-lateral {
    color: cor(--cor-preto);
    font-size: 4rem;
    font-weight: bold;
    writing-mode: vertical-rl;
    transform: rotate(0deg);
}

/* Imagem */
.imagem-container img {
    max-width: 100%;
    border-radius: 10px;
}

/* Linha divisória */
.linha-divisoria {
    width: 100%;
    height: 10px;
    background: var(--cor-terciaria);
    margin: 2rem 0;
    margin-top: 0;
}

/* Conteúdo */
.conteudo {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.subtitulo {
    font-size: 1.8rem;
    color: var(--cor-terciaria);
    margin-top: 1.5rem;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

ul li {
    font-size: 1.1rem;
    color: var(--cor-terciaria);
    background: rgba(0, 0, 0, 0.05);
    padding: 0.75rem;
    border-radius: 5px;
    margin: 0.5rem 0;
}

.conteudo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
}

.grid-item {
    background: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
}

.subtitulo {
    font-size: 1.8rem;
    color: var(--cor-terciaria);
    margin-bottom: 1rem;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

ul li {
    font-size: 1.1rem;
    color: var(--cor-terciaria);
    margin: 0.5rem 0;
}

/* Responsividade */
@media (max-width: 768px) {
    .titulo {
        font-size: 2rem;
    }

    .descricao {
        font-size: 1rem;
    }

    .container {
        max-width: 100%;
        flex-direction: column;
        width: 100%;
        padding: 0;
        align-items: center;
        justify-content: center;
    }

    .barra-lateral {
        width: 100%;
        height: auto;
        transform: rotate(0deg);
    }

    .texto-lateral {
        font-size: 2rem;
        padding: 0;
        box-sizing: border-box;
        transform: rotate(270deg);
    }

    .subtitulo {
        font-size: 1.5rem;
    }

    ul li {
        font-size: 1rem;
    }
}
</style>