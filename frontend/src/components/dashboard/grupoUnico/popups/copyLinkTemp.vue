<template>
    <div v-if="visible" class="popup">
      Link copiado!
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, defineEmits } from 'vue';
  
  const emits = defineEmits(['closed']);
  const visible = ref(false);
  
  // Função para mostrar o popup
  function showPopup() {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
      emits('closed');
    }, 3000);
  }
  
  // Expor para o componente pai (caso necessário)
  onMounted(() => {
    showPopup();
  });
  </script>
  
  <style scoped>
  .popup {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: slide-up 0.3s ease-out;
    font-size: 14px;
  }
  
  @keyframes slide-up {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  </style>
  