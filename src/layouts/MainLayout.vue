<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row" elevated style="height: 80px">
      <q-toolbar class="row items-center">
        <q-btn v-if="isChat" icon="arrow_back" flat dense @click="$router.push('/usuario')" />
        <div class="row">
          <q-toolbar-title>
            <div class="row items-center">
              <q-icon v-if="isChat" class="q-pr-md" name="account_circle" size="50px" />
              <div class="column">
                {{ getTitle }}
                <span v-if="isChat" style="font-size: 12px">Online</span>
              </div>
            </div>
          </q-toolbar-title>
        </div>

        <q-btn
          v-if="!isChat && !this.$route.fullPath.includes('/auth')"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Sair"
          @click="sair"
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
import { storeChat } from '../store/store'
import { usuarioStore } from 'src/store/usuarioStore'

export default defineComponent({
  name: 'MainLayoutComponent',
  data() {
    const storeChatInstance = storeChat()
    const usuarioStoreInstance = usuarioStore()

    return {
      storeChatInstance,
      usuarioStoreInstance,
    }
  },

  computed: {
    getInformacoesOutroUsuario() {
      if (this.storeChatInstance.users[this.$route.params.idOutroUsuario]) {
        return this.storeChatInstance.users[this.$route.params.idOutroUsuario]
      }
      return {}
    },
    getTitle(): string {
      const currentPath: string = this.$route.fullPath

      const titleMapper: Record<string, string> = {
        '/': 'Chat Vue 3',
        '/chat': 'Chat',
        '/auth': 'Autenticação',
      }

      if (currentPath.includes('/chat')) {
        return this.getInformacoesOutroUsuario.name
      }

      return titleMapper[currentPath] ?? 'Página Inicial'
    },

    isChat(): boolean {
      return this.$route.fullPath.includes('/chat')
    },
  },

  mounted() {
    console.log('User', this.usuarioStoreInstance.getUsuarioLogado)
  },

  unmounted() {
    this.sair()
  },

  methods: {
    sair(): void {
      this.storeChatInstance.sair()
      this.$router.push('/auth')
    },
  },
})
</script>
