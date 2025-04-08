<template>
    <div class="popup-overlay">
        <div class="popup-content">
            <button class="close-button" @click="$emit('close')">✕</button>

            <h2 class="popup-title">Insira o nome da pasta</h2>

            <input type="text" v-model="nomePasta" placeholder="Nome da pasta" class="popup-input" />

            <button class="icon-button mt-4" @click="emitirCriacao">
                Criar
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nomePasta: '',
        };
    },
    methods: {
        emitirCriacao() {
            if (this.nomePasta.trim()) {
                this.$emit('criar', this.nomePasta.trim());
                this.$emit('close');
            }
        }
    }

};
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    position: relative;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    font-size: 1.25rem;
    background: transparent;
    border: none;
    color: #777;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: #e74c3c;
}

.popup-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
}

.popup-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    outline: none;
    transition: border 0.3s;
}

.popup-input:focus {
    border-color: var(--cor-principal, #07608a);
}

/* Usa a sua estilização */
.icon-button {
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
    color: var(--cor-branco, #fff);
    border: none;
    border-radius: 50px;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.icon-button:hover {
    background: var(--cor-secundaria, #05506f);
}
</style>