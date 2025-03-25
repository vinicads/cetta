<template>
  <Mensagem :mensagem="mensagemErro" v-if="!mensagemSucesso && !mensagemAlerta" tipo="Erro"
    @fechar-modal="fecharModal" />
  <Mensagem :mensagem="mensagemSucesso" v-if="!mensagemErro && !mensagemAlerta" tipo="Sucesso"
    @fechar-modal="fecharModal" />
  <Mensagem :mensagem="mensagemAlerta" v-if="!mensagemErro && !mensagemSucesso" tipo="Alerta"
    @fechar-modal="fecharModal" />
  <div class="display">
    <div class="containerSmall">
      <popupCarregamentoTemp v-if="loading" />

      <div class="title">Configuração do sistema</div>
      <div class="form-container">


        <div class="form-group">
          <h2>Contato:</h2>
          <div class="form-group">
            <label for="emailContato">E-mail:</label>
            <input type="text" class="form-control" maxlength="100" id="emailContato" v-model="emailContato" required>
          </div>
          <div class="form-group">
            <label for="numeroContato">Telefone:</label>
            <input type="text" class="form-control" maxlength="14" id="numeroContato" v-model="numeroContato"
              @input="mascaraTelefoneInput" @paste="colarTelefoneInput" required>
          </div>
        </div>
        <div class="form-group">
          <h2>Frete individual:</h2>
          <div class="form-group">
            <label for="valorFreteIndividual">Valor:</label>
            <input type="text" class="form-control" id="valorFreteIndividual" @focus="removerMascaraValor"
              @blur="aplicarMascaraValor" v-model="valorFreteIndividual" required>
          </div>
        </div>

        <div class="form-group">
          <h2>Exibição:</h2>
          <div class="form-group">
            <label for="qtdeEmpresa">Quantidade de Empresas:</label>
            <input type="number" class="form-control" id="qtdeEmpresa" v-model="qtdeEmpresa" required>
          </div>
          <div class="form-group">
            <label for="qtdeFretes">Quantidade de Fretes:</label>
            <input type="number" class="form-control" id="qtdeFretes" v-model="qtdeFretes" required>
          </div>
          <div class="form-group">
            <label for="qtdeContatos">Quantidade de Contatos:</label>
            <input type="number" class="form-control" id="qtdeContatos" v-model="qtdeContatos" required>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button @click="cadastrarConfig" v-if="!data">Cadastrar</button>
        <button @click="atualizarConfig" v-else>Atualizar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';
import router from '@/router/index.js'
import store from '@/auth/autenticacao.js'
import VueCookies from 'vue-cookies';
import popupCarregamentoTemp from '../../../popups/popupCarregamentoTemp.vue'
import Mensagem from '../../../alertas/mensagensTemp.vue';
import { ref } from 'vue';
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, colarCEP, MascaraCEP, retornaCidade, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
  components: {
    Mensagem,
    popupCarregamentoTemp,
  },
  name: 'planosComponent',
  data() {
    return {
      loading: false,
      isMobile: window.innerWidth < 768,
      apiUrl: store.state.apiUrl,
      perfil: store.state.perfil,
      mensagemErro: '',
      mensagemSucesso: '',
      mensagemAlerta: '',
      data: null,
      valorFreteIndividual: '',
      emailContato: '',
      numeroContato: '',
      qtdeContatos: '',
      qtdeEmpresa: '',
      qtdeFretes: '',
    }
  },
  mounted() {
    if (this.perfil != 'Admin') {
      this.$router.push({ name: 'home' })
    }
    this.getGeral();
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  },
  methods: {
    aplicarMascaraValor() {
      let valorNumerico = this.valorFreteIndividual.replace(/\D/g, '');

      let valorFormatado = parseFloat(valorNumerico / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      this.valorFreteIndividual = valorFormatado;
    },
    aplicarMascaraValorRetorno(valor) {
      let valorNumerico = valor.replace(/[^\d,.-]/g, '');
      valorNumerico = valorNumerico.replace(',', '.');
      let valorFloat = parseFloat(valorNumerico);

      let valorFormatado = valorFloat.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      return valorFormatado;
    },
    removerMascaraValor() {
      let valorNumerico = this.valorFreteIndividual.replace(/[^\d,]/g, '');

      this.valorFreteIndividual = valorNumerico;
    },
    removerMascaraValorRetorno(valor) {
      let valorNumerico = valor.replace(/[^\d,]/g, '').replace(',', '.');

      return valorNumerico;
    },
    mascaraTelefoneInput(event) {
      if (this.numeroContato.length == 14) {
        this.numeroContato = colarCelular(this.numeroContato, event)
      } else {
        this.numeroContato = MascaraCelular(this.numeroContato.replace(/\s/g, ''), event);
      }
    },
    colarTelefoneInput(event) {
      var aux = colarCelular(event.clipboardData.getData('text').replace(/\s/g, ''), event);
      this.numeroContato = aux;
    },
    async atualizarConfig() {
      this.loading = true;

      let valorFreteIndividual = '', numeroContato = ''


      if (this.valorFreteIndividual){
        valorFreteIndividual = this.removerMascaraValorRetorno(this.valorFreteIndividual)
      }

      if(this.numeroContato){
        numeroContato = RemoveMascaraContato(this.numeroContato)
      }
      const data = {
        "infoGeral": {
          "numeroContato": numeroContato,
          "emailContato": this.emailContato,
          "qtdeEmpresa": this.qtdeEmpresa,
          "qtdeContatos": this.qtdeContatos,
          "qtdeFretes": this.qtdeFretes
        },
        "valorFrete": valorFreteIndividual
      }

      await axios.put(`${store.state.apiUrl}/infoGeral/${this.data.idGeral}`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.mensagemSucesso = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal()
                    if (error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }else{
                      this.mensagemErro = "Algo deu errado.";
                    }

                    this.loading = false;
                });
    },
    async cadastrarConfig() {
      this.loading = true;

      let valorFreteIndividual = '', numeroContato = ''


      if (this.valorFreteIndividual){
        valorFreteIndividual = this.removerMascaraValorRetorno(this.valorFreteIndividual)
      }

      if(this.numeroContato){
        numeroContato = RemoveMascaraContato(this.numeroContato)
      }
      const data = {
        "infoGeral": {
          "numeroContato": numeroContato,
          "emailContato": this.emailContato,
          "qtdeEmpresa": this.qtdeEmpresa,
          "qtdeContatos": this.qtdeContatos,
          "qtdeFretes": this.qtdeFretes,
          "valorFreteIndividual": Number(valorFreteIndividual)
        },
        "valorFrete": valorFreteIndividual
      }

      await axios.post(`${store.state.apiUrl}/infoGeral`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    this.mensagemSucesso = response.data;
                    this.getGeral()
                    this.loading = false;
                })
                .catch(error => {
                    this.fecharModal()
                    if (error.response.data) {
                        if (error.response.data.message) {
                            this.mensagemErro = error.response.data.message[0];
                        } else {
                            this.mensagemErro = error.response.data;
                        }
                    }else{
                      this.mensagemErro = "Algo deu errado.";
                    }

                    this.loading = false;
                });
    },
    async getGeral() {
      this.loading = true;
      this.semResultado = false;
      await axios.get(`${store.state.apiUrl}/public/infoGeral`, {
        withCredentials: true,
      })
        .then((response) => {
          this.data = response.data;
          this.numeroContato = colarCelular(this.data.numeroContato)
          this.emailContato = this.data.emailContato
          this.qtdeContatos = this.data.qtdeContatos
          this.qtdeEmpresa = this.data.qtdeEmpresa
          this.qtdeFretes = this.data.qtdeFretes
          this.valorFreteIndividual = this.aplicarMascaraValorRetorno(this.data.valorFreteIndividual.toString())
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    formatData(dateString) {
      const date = new Date(dateString);
      const dia = date.getUTCDate().toString().padStart(2, '0');
      const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const ano = date.getUTCFullYear();

      return `${dia}/${mes}/${ano}`;
    },
    fecharModal() {
      this.mensagemErro = '';
      this.mensagemAlerta = '';
      this.mensagemSucesso = '';
    },
  }
}
</script>

<style scoped>
.containerSmall {
  border-radius: 15px;
  padding: 1%;
  margin: 5rem auto;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--cor-branco);
  padding-bottom: 1%;
  margin-top: 8rem;
}

.title {
  font-size: 2rem;
  color: var(--cor-preto);
  font-weight: bold;
  text-align: left;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.aviso {
  text-align: center;
  margin-block: 3%;
  font-size: 18px;
}

.botaoPrimario {
  border-radius: 15px;
  color: white;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  background-color: var(--cor-principal);
  border: 1px solid var(--cor-principal);
  transition: 0.5s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.botaoPrimario:hover {
  background-color: var(--cor-branco);
  color: var(--cor-principal);
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 1%;
}

.form-group .form-group {
  padding: 0;
  background-color: transparent;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  transition: 0.5s ease-in-out;
}

.form-group select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  cursor: pointer;
}

.form-group select .select-option {
  background-color: var(--cor-branco);
  color: var(--cor-preto);
}

.select-option:hover {
  background-color: var(--cor-principal) !important;
}

.buttons {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  width: 100%;
  gap: 1%;
}

.buttons button {
  border-radius: 15px;
  border: none;
  color: white;
  padding: 10px;
  background-color: var(--cor-principal);
  border: 1px solid var(--cor-principal);
  width: 20%;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:hover {
  color: var(--cor-principal);
  background-color: transparent;
}


@media (min-width: 768px) {

  .title {
    text-align: left;
    font-size: 3rem;
  }

}

@media(max-width: 767px) {

  .containerSmall {
    padding: 5%;
    margin-top: 9rem;
  }

  .form-container {
    grid-template-columns: 1fr;
  }

  .form-group {
    margin-bottom: 0;
  }

  .form-group:nth-child(odd) {
    margin-right: 15px;
  }

  .buttons{
    justify-content: center;
  }

  .buttons button{
    width: 100%;
  }

}



@media (max-width: 375px) {
  .title {
    text-align: left;
    font-size: 1.5rem;
  }

}
</style>
