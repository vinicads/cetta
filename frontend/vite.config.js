import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': true
  },
  server: {
    port: 5173
  },
  plugins: [
    vue(),
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://api.externa.com', // A URL da API externa
  //       changeOrigin: true,
  //       secure: false, // Desative a verificação SSL (para desenvolvimento)
  //       cookieDomainRewrite: {
  //         '*': '', // Define como um domínio vazio para permitir cookies de terceiros
  //       },
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
