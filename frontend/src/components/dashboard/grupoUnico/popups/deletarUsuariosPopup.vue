<template>

    <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
      @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
      @fechar-modal="fecharModal" />
    <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
      @fechar-modal="fecharModal" />
    <div class="modal-overlayy" @click="closePopupOnOverlay">
      <div class="modal-contentt">
        <popupCarregamentoTemp v-if="loading" />
        <div class="headerTitle">
          Confirmação de exclusão
        </div>
        <div class="headerModall">
          Tem certeza que deseja remover o usuário?
          Esse processo é irreversível.
        </div>
  
        <div class="avisoModall">
          <div class="botaoFecharApagar"><button @click="remover">Apagar</button></div>
          <div class="botaoFecharCancelar"><button @click="closePopup">Cancelar</button></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import store from '@/auth/autenticacao';
  import axios from 'axios';
  import Mensagem from '@/components/alertas/mensagensTemp.vue';
  import popupCarregamentoTemp from '@/components/popups/popupCarregamentoGeralTemp.vue';
  
  export default {
    emits: ['close'],
    props: {
      idGrupo: Number,
      idConta: Number
    },
    components: {
      Mensagem,
      popupCarregamentoTemp
    },
    data() {
      return {
        mensagemAlerta: '',
        mensagemErro: '',
        mensagemSucesso: '',
        idAutenticacao: '',
        loading: false,
      }
    },
    methods: {
      cadastrarAtalho(event) {
        if (event.key == 'Enter') {
          this.remover();
        }
      },
      fecharModal() {
        this.mensagemErro = '';
        this.mensagemAlerta = '';
        this.mensagemSucesso = '';
      },
      remover() {
        this.loading = true;
        this.mensagemAlerta = '';
        this.mensagemErro = '';
        this.mensagemSucesso = '';
        axios.delete(`${store.state.apiUrl}/grupos/remover/usuario/${this.idConta}/${this.idGrupo}`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            this.closePopup()
          })
          .catch((error) => {
            if (error.response.data.message) {
              if (typeof (error.response.data.message) == 'string') {
                var mensagem = error.response.data.message;
              } else {
                var mensagem = error.response.data.message[0];
              }
            } else {
              var mensagem = error.response.data;
            }
  
            if (typeof (mensagem) == Object) {
              mensagem = 'Usuário não encontrado.'
            }
  
            this.mensagemErro = mensagem;
  
          });
        this.loading = false;
      },
      closePopup() {
        this.$emit('close');
      },
      closePopupOnOverlay(event) {
        if (event.target === event.currentTarget) {
          this.closePopup();
        }
      },
      onEscKey(event) {
        if (event.key === 'Escape') {
          this.closePopup();
        }
      },
      atalho(event) {
        if (!this.mensagemAlerta && !this.mensagemErro && !this.mensagemSucesso && !this.loading)
          if (event.key == 'Enter') {
            this.loading = true;
            this.remover();
          }
      },
    },
    mounted() {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', this.atalho);
      document.addEventListener('keydown', this.onEscKey);
      document.addEventListener('keydown', this.cadastrarAtalho)
    },
    beforeUnmount() {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this.onEscKey);
      document.removeEventListener('keydown', this.cadastrarAtalho);
      document.removeEventListener('keydown', this.atalho);
    },
  };
  </script>
  
  <style scoped>
  .modal-overlayy {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.741);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  
  }
  
  .modal-contentt {
    background-color: #f2f2f2;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 30%;
    padding: 20px;
    max-height: 90%;
  }
  
  .headerTitle {
    font-size: 25px;
    width: 100%;
    text-align: left;
  }
  
  .linha {
    background-color: rgb(207, 207, 207);
    width: 50%;
    height: 2px;
    margin: 5%;
    margin: 0 auto;
  }
  
  .headerModall {
    margin: 5%;
    font-size: 15px;
    background-color: rgba(255, 0, 0, 0.322);
    padding: 5%;
    border-radius: 15px;
    word-wrap: break-word;
  
  }
  
  
  .avisoModall {
    margin-top: 5%;
    display: flex;
  }
  
  
  
  .botaoFecharApagar {
    margin-right: 1%;
    width: 100%;
  }
  
  .botaoFecharCancelar {
    margin-right: 1%;
    width: 100%;
  }
  
  .botaoFecharApagar button {
    border-radius: 15px;
    border: none;
    color: white;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--cor-principal);
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
  }
  
  .botaoFecharApagar button:hover {
    background: transparent;
    color: var(--cor-principal);
    transition: 0.2s;
  }
  
  .botaoFecharCancelar button {
    border-radius: 15px;
    border: none;
    color: white;
    width: 100%;
    padding: 10px;
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
  }
  
  .botaoFecharCancelar button:hover {
    background-color: transparent;
    color: #000;
    transition: 0.2s;
  }
  
  
  @media (max-width: 768px) {
  
    .modal-contentt {
      min-width: 30%;
      max-width: 90%;
      padding: 10px;
    }
  }
  </style>