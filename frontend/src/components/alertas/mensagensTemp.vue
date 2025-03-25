<template>
  <div v-if="mensagem" class='modal-container'>
    <div :class="['modal-content', tipo]">
      <span class="fechar" @click="fecharModal">X</span>
      <div class='headerModal'>
        {{ tipo }}
      </div>
      <div class="avisoModal">
        <div class="texto">{{ mensagem }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['fecharModal', 'fechar-modal'],
  props: {
    mensagem: String,
    tipo: String,
  },
  methods: {
    fecharModal() {
      this.$emit('fechar-modal');
    },
    fecharAutomatico() {
      setTimeout(() => {
        this.fecharModal();
      }, 3000);
    },
  },
  watch: {
    mensagem(newMensagem) {
      if (newMensagem) {
        this.fecharAutomatico();
      }
    },
  },
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  bottom: 20px; 
  left: 10px;
  z-index: 9999999999999999999999999999;
 
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #FFF;
  text-align: center;
  width: 90%; /* Largura do modal ajustada para 90% da largura da tela */
  min-width: 200px;
  max-width: 400px; /* Largura máxima do modal */
  padding: 20px;
  max-height: 90%; /* Altura máxima do modal */
}

.headerModal {
  margin-bottom: 0;
  font-size: 35px;
}

.fechar{
  position: absolute;
  top: 10px;
  right: 10px;
}

.fechar:hover{
  cursor: pointer;
  transform: scale(1.01);
}

.modal-content.Erro {
  background-color: var(--cor-preto);
}

.modal-content.Sucesso {
  background-color: green;
}

.modal-content.Alerta {
  background-color: rgb(146, 146, 0);
}

.avisoModal {
  margin-top: 20px;
}

.botaoFechar button {
  border-radius: 15px;
  border: none;
  color: white;
  width: 100%;
  padding: 10px;
}

.botaoFechar {
  margin-top: 20px;
}

.botaoFechar.Erro button {
  background-color: red;
}

.botaoFechar.Sucesso button {
  background-color: green;
}

.botaoFechar.Alerta button {
  background-color: rgb(158, 158, 1);
}

.botaoFechar.Erro button:hover {
  background-color: rgb(139, 8, 8);
}

.botaoFechar.Sucesso button:hover {
  background-color: rgb(3, 63, 3);
}

.botaoFechar.Alerta button:hover {
  background-color: rgb(77, 77, 1);
}

@media (max-width: 768px) {

.headerModal{
  font-size: 20px;
  margin-top: 2%;
}

.avisoModal{
  font-size: 15px;
}

  .modal-content {
    min-width: 60%;
    max-width: 70%; 
    padding: 10px;
  }

}
</style>

