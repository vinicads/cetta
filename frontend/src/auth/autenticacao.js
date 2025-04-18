// auth/autenticacao.js
import { createStore } from 'vuex';
import axios from 'axios';
import VueCookies from 'vue-cookies';
export default createStore({
  state: {
    isVerified: false,
    autenticacao: null,
    isAuthenticated: false,
    dadosPessoais: null,
    perfil: null,
    assinatura: null,
    historicoPagamento: null,
    pagamentoAtivo: false,
    pagamentoAssinatura: null,
    apiUrl: 'http://localhost:3000',
    api: 'programacetta.com/api',
    cookieAccepted: false,
    loading: false
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setcookieAccepted(state, cookieAccepted) {
      state.cookieAccepted = cookieAccepted;
    },
    setisVerified(state, isVerified) {
      state.isVerified = isVerified;
    },
    setPagamentoAssinatura(state, pagamentoAssinatura) {
      state.pagamentoAssinatura = pagamentoAssinatura;
    },
    setHistoricoPagamento(state, historicoPagamento) {
      state.historicoPagamento = historicoPagamento;
    },
    setisAutenticacao(state, autenticacao) {
      state.autenticacao = autenticacao;
    },
    setPagamentoAtivo(state, pagamentoAtivo) {
      state.pagamentoAtivo = pagamentoAtivo;
    },
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setDadosPessoais(state, dadosPessoais) {
      state.dadosPessoais = dadosPessoais;
    },
    setPerfil(state, perfil) {
      state.perfil = perfil;
    },
    setAssinatura(state, assinatura) {
      state.assinatura = assinatura;
    },
  },
  actions: {
    async checkAuthentication(context) {
      console.log("%cEspere!","color: red; Font-family: 'Fira Sans', sans-serif; font-size: 50px");
      console.log("%cEste é um recurso de navegador voltado para desenvolvedores. Se alguém disse para você copiar e colar algo aqui para ativar um recurso do site ou \"roubar\" os dados de outra pessoa, isso é uma fraude e você dará a ele acesso à suas informações.","Font-family: 'Fira Sans', sans-serif; font-size: 20px");
      try {
        const response = await axios.get(`${this.state.apiUrl}/login`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          context.commit('setDadosPessoais', response.data.dadosPessoais);
          context.commit('setPerfil', response.data.perfil);
          context.commit('setcookieAccepted', response.data.cookieAccepted);
          context.commit('setAssinatura', response.data.assinatura);
          context.commit('setHistoricoPagamento', response.data.historicoPagamento);
          if (response.data.assinatura){
            response.data.assinatura.forEach(assinatura => {
              if (assinatura.codPagamento){
                context.commit('setPagamentoAtivo', true);
              }
            });
          }
         
          context.commit('setisAutenticacao', response.data.autenticacao);
          context.commit('setAuthenticated', true);
          context.commit('setisVerified', true);
        }
      } catch (error) {
        context.commit('setcookieAccepted', error.response.data.cookieAccepted);
        context.commit('setAuthenticated', false);
        context.commit('setDadosPessoais', null);
        context.commit('setisAutenticacao', null);
        context.commit('setPerfil', null);
        context.commit('setAssinatura', null);
        context.commit('setHistoricoPagamento', null);
        context.commit('setisVerified', true);
      }
    },
  },
});
