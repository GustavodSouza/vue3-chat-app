<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row" elevated style="height: 80px">
      <q-toolbar class="row items-center">
        <q-btn 
          v-if="isChat" 
          icon="arrow_back" 
          flat 
          dense 
          @click="redirecionarConversas" 
        />
        <div class="row">
          <q-toolbar-title>
            <div class="row items-center">
              <q-icon 
                v-if="isChat" 
                class="q-pr-md" 
                name="account_circle" 
                size="50px" 
              />
              <div class="column">
                <span>
                  {{ getTituloPagina }}
                </span>
                <span 
                  v-if="isChat" 
                  style="font-size: 12px"
                >
                  {{ getInformacoesOutroUsuario?.online ? 'Online' : 'Offline' }}
                </span>
              </div>
            </div>
          </q-toolbar-title>
        </div>

        <q-btn
          v-if="isNotLogin"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Sair"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { usuarioStore } from 'src/store/usuarioStore'

export default defineComponent({
  name: 'MainLayoutComponent',
 
  data() {
    const usuarioStoreInstance = usuarioStore()

    return {
      usuarioStoreInstance,
    }
  },

  computed: {
    getInformacoesUsuarioLogado() {
      return this.usuarioStoreInstance.usuarioLogado
    },

    getInformacoesOutroUsuario() {
      return this.usuarioStoreInstance.usuarios.get(this.$route.params.idOutroUsuario)
    },

    getTituloPagina(): string {
      if (this.getInformacoesOutroUsuario) {
        return this.getInformacoesOutroUsuario.nome
      }

      if (this.getInformacoesUsuarioLogado && this.$route.path !== '/') {
        return this.getInformacoesUsuarioLogado.nome
      }

      return 'Chat App'
    },

    isChat(): boolean {
      return this.$route.fullPath.includes('/chat')
    },

    isNotLogin(): boolean {
      return this.$route.fullPath !== '/'
    }
  },

  methods: {
    logout(): void {
      this.usuarioStoreInstance.logout()
      this.$router.push('/')
    },

    redirecionarConversas(): void {
      this.$router.push('/conversas-usuario')
    }
  },
})
</script>
