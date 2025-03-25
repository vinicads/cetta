<template>
    <div class='modal-container'>
      <div class="modal-content">
        <span class="fechar" @click="fecharModal">X</span>
        <div class='headerModal'>
            <img src="../../assets/icons/check.png" v-if="data.tipo != 'criado'" alt="">
            <img src="../../assets/icons/wait.png" v-else alt="">
        </div>
        <div class="avisoModal">
          <div class="texto" v-if="data.tipo == 'criado'">Recebemos sua solicitação de pagamento.</div>

          <div class="title" v-if="data.tipo == 'frete'">Confirmação de pagamento</div>
          <div class="texto" v-if="data.tipo == 'frete'">Frete adicionado.</div>

          <div class="title" v-if="data.tipo == 'assinatura'">Confirmação de pagamento</div>
          <div class="texto" v-if="data.tipo == 'assinatura'">Benefícios da assinatura disponibilizados.</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import store from '@/auth/autenticacao.js';
  export default {
    emits: ['fecharPagamento'],
    data() {
        return {
           
           assinatura: store.state.assinatura,
        };
    },
    props: {
      data: Object,
    },
    methods: {
      fecharModal() {
        this.$emit('fecharPagamento');
      },
      fecharAutomatico() {
        setTimeout(() => {
          this.fecharModal();
        }, 5000);
      },
    },
    mounted() {
        this.fecharAutomatico();
        if (this.data.tipo == 'assinatura'){
            let assinatura = this.assinatura;
            assinatura.qtdeContatos = this.data.qtdeContatos
            assinatura.qtdeFretes = this.data.qtdeFretes
            assinatura.prazo = this.data.prazo
            assinatura.status = this.data.status
            store.commit('setAssinatura', assinatura);
        }

        if (this.data.tipo == 'frete'){
            let frete = this.assinatura;
            frete.qtdeFretes = this.data.qtdeFretes
            store.commit('setAssinatura', frete);
        }
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
    color: var(--cor-preto);
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

  .headerModal img{
    width: 50px;
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
  
  .modal-content {
    background-color: var(--cor-branco);
  }
  
  
  .avisoModal {
    margin-top: 20px;
    color: var(--cor-preto);
  }
  
  .title{
    font-weight: bold;
    font-size: 1.2rem;
  }

  .texto{
    font-size: 1rem;
  }

  .botaoFechar button {
    border-radius: 15px;
    border: none;
    color: var(--cor-preto);
    width: 100%;
    padding: 10px;
  }
  
  .botaoFechar {
    margin-top: 20px;
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
      width: 50vw;
      padding: 10px;
    }
  
  }
  </style>
  
  