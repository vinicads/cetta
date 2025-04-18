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
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('../components/login/cadastroTemp.vue'),
      beforeEnter: verificaLogin
    },
    {
      path: '/meuPerfil',
      name: 'meuPerfil',
      component: () => import('../components/dashboard/perfil/perfilTemplate.vue'),
      beforeEnter: authGuard
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: () => import('../components/sobre/sobreTemp.vue'),
    },
    {
      path: '/comoFunciona',
      name: 'comoFunciona',
      component: () => import('../components/funciona/funcionaTemp.vue'),
    },
    {
      path: '/grupos',
      name: 'grupos',
      component: () => import('../components/dashboard/grupos/gruposTemp.vue'),
    },
    {
      path: '/grupos/:id', 
      name: 'grupoUnico',
      component: () => import('../components/dashboard/grupoUnico/grupoUnicoTemp.vue'),
      props: true,
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
      path: '/admin/grupos',
      name: 'gruposAdmin',
      component: () => import('../components/dashboard/administrativo/grupos/gruposTemp.vue'),
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
  ],
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  store.commit('setLoading', true);
  next();
});

router.afterEach(() => {
  store.commit('setLoading', false);
});

export default router
