import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/LoginCadastro.vue') },
      { path: 'login', component: () => import('../pages/LoginCadastro.vue') },
      { path: 'chat/:idOutroUsuario', name: 'chat', component: () => import('../pages/Chat.vue') },
      { path: 'usuario', component: () => import('../pages/ConversasUsuario.vue') },
      { path: 'auth', component: () => import('../pages/Auth.vue') },
    ],
  },
]

export default routes
