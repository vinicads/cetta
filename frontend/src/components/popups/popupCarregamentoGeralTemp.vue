<template>
    <div class="loading-screen">
      <div class="spinner"></div>
    </div>
  </template>
  
<script></script>

  <style scoped>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #37373763;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999999999999999999999;
    color: var(--cor-branco);
  }
  
  .spinner {
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
  