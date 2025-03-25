import { createRouter, createWebHistory } from 'vue-router'
import authGuard from '../auth/authGuard'
import verificaLogin from '../auth/verificaLogado'
import store from '@/auth/autenticacao.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/home/homeTemp.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/login/LoginTemp.vue'),
      beforeEnter: verificaLogin
    },
    {
      path: '/cadastroGeral',
      name: 'cadastroGeral',
      component: () => import('../components/login/cadastroGeralTemp.vue'),
      beforeEnter: verificaLogin
    },
    {
      path: '/cadastro/empresa',
      name: 'cadastroEmpresa',
      component: () => import('../components/login/cadastroEmpresaTemp.vue'),
      beforeEnter: verificaLogin
    },
    {
      path: '/cadastro/motorista',
      name: 'cadastroMotorista',
      component: () => import('../components/login/cadastroMotoristaTemp.vue'),
      beforeEnter: verificaLogin
    },
    {
      path: '/meuPerfil',
      name: 'meuPerfil',
      component: () => import('../components/dashboard/perfil/perfilTemplate.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/recrutadores',
      name: 'recrutadores',
      component: () => import('../components/dashboard/recrutadores/recrutadoresTemp.vue'),
    },
    {
      path: '/recrutadores/:id',
      name: 'recrutador',
      component: () => import('../components/dashboard/recrutadores/recrutadorUnico/recrutadorUnicoTemp.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/fretes',
      name: 'fretes',
      component: () => import('../components/dashboard/fretes/fretesTemp.vue'),
    },
    {
      path: '/politicas',
      name: 'politicas',
      component: () => import('../components/politicas/politicasTemp.vue'),
    },
    {
      path: '/admin/planos',
      name: 'planosAdmin',
      component: () => import('../components/dashboard/administrativo/planos/planosTemp.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/admin/usuarios',
      name: 'usuariosAdmin',
      component: () => import('../components/dashboard/administrativo/usuarios/usuariosTemp.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/admin/geral',
      name: 'geralAdmin',
      component: () => import('../components/dashboard/administrativo/geral/geralTemp.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'paginaNaoEncontrada' },
    },
    {
      path: '/notfound',
      name: 'paginaNaoEncontrada',
      component: () => import('../components/errors/notFound.vue'),
    },
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('setLoading', true);
  next();
});

router.afterEach(() => {
  store.commit('setLoading', false);
});

export default router
