<template>
  <div class="loading-screen">
    <div class="loading-content">
      <p>Verificando credenciais...</p>
      <div class="spinner"></div>

    </div>
  </div>
</template>

<script></script>

<style scoped>
.loading-screen {
  position: fixed;
  bottom: 20px;
  right: 20px; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2%;
  border-radius: 15px;
  background-color: black;
  z-index: 999999999999999999999999999;
}

.loading-content {
  display: block;
  text-align: center;
  color: white;
}

p{
  margin: 0;
}

.spinner {
  margin: 0 auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--cor-principal);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
