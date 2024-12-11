import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/Usuario.vue') },
      { path: 'chat/:idOutroUsuario', component: () => import('../pages/Chat.vue') },
      { path: 'auth', component: () => import('../pages/Auth.vue') },
    ],
  },
]

export default routes
