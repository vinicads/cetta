<template>
    <div class="container">
        <div class="title">Conheça a Encontrando Fretes</div>
        <div class="subtitle">Facilitando a vida para motoristas e transportadoras</div>
        <div class="cards">
            <div class="cardSobre">
                <div class="imagem"><img src="../../../assets/images/caminhao.png" alt="Card Image"></div>
                <h3>Motoristas</h3>
                <p>Os motoristas podem se cadastrar para serem escolhidos por empresas</p>
            </div>
            <div class="cardSobre">
                <div class="imagem"><img src="../../../assets/images/meeting.png" alt="Card Image"></div>
                <h3>Empresas</h3>
                <p>As empresas podem se cadastrar e divulgar fretes, desbloqueando motoristas compativeis</p>
            </div>
            <div class="cardSobre">
                <div class="imagem"><img src="../../../assets/images/enterprise.png" alt="Card Image"></div>
                <h3>Encontrando Fretes</h3>
                <p>Conectamos voce motorista autônomo a diversas empresas que precisam de transporte.</p>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
.container {
    text-align: center;
}

.title {
    color: var(--cor-preto);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.subtitle {
    color: var(--cor-preto);
    font-size: 1.2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
}

.cardSobre {
    border-radius: 8px;
    transition: transform 0.3s;
    width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.cardSobre:hover {
    transform: translateY(-5px);
}

.imagem{
    background-color: var(--cor-principal);
    width: 100%;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin-bottom: 5%;
    overflow: hidden;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.cardSobre .imagem img {
    padding: 5%;
    width: 50%;
    height: auto;
    object-fit: cover;
    filter: invert(100%);
}

.cardSobre h3 {
    font-size: 1.5rem;
    color: var(--cor-preto);
}

.cardSobre p {
    font-size: 1rem;
    color: #555;
}
</style>
