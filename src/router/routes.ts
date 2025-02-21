import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('src/pages/Auth.vue'),
        meta: {
          tituloPagina: 'Autenticação'
        }
      },

      { 
        path: '/chat/:idOutroUsuario', 
        component: () => import('src/pages/Chat.vue'),
        meta: {
          tituloPagina: 'Chat'
        }
      },

      { 
        path: '/conversas-usuario',
        component: () => import('src/pages/ConversasUsuario.vue'),
      },
    ],
  },
]

export default routes
