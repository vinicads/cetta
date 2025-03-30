<template>
  <div>

    <div v-if="loading" class="loading-Geral">
      <div class="loading-screen">
      <div class="spinner"></div>
    </div>
    </div>
    <navbarTemp v-if="$route.path != '/login' && !loading && $route.path != '/cadastro'" />
    <RouterView />
    <footerTemp v-if="$route.path != '/login' && !loading && $route.path != '/cadastro'"/>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import navbarTemp from './components/navbar/navbarTemp.vue';
import footerTemp from './components/footer/footerTemp.vue';
import store from '@/auth/autenticacao.js';

const loading = ref(false);

watch(() => store.state.loading, (newValue) => {
  loading.value = newValue;
});
</script>

<style scoped>
 .loading-screen {
    z-index: 999999999999999999999999999;
    color: var(--cor-branco);
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--cor-preto);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

.loading-Geral {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--cor-principal);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

</style>
