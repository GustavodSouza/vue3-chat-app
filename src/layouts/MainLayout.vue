<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row" elevated style="height: 80px">
      <q-toolbar class="row items-center">
        <q-btn v-if="isChat" icon="arrow_back" flat dense @click="$router.push('/')" />
        <q-toolbar-title>
          <div class="row items-center">
            <q-icon v-if="isChat" class="q-pr-md" name="account_circle" size="50px" />
            <div class="column">
              {{ getTitle }}
              <p v-if="isChat" style="font-size: 15px">Online</p>
            </div>
          </div>
        </q-toolbar-title>
        <q-btn
          v-if="!storeChatInstance?.userDetails?.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Login"
        />

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

export default defineComponent({
  name: 'MainLayoutComponent',
  data() {
    const storeChatInstance = storeChat()

    return {
      storeChatInstance,
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
        '/auth': 'Login',
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

  methods: {
    sair(): void {
      this.storeChatInstance.sair()
    },
  },
})
</script>
