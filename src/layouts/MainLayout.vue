<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row items-center">
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          icon="arrow_back"
          label="Voltar"
          flat
          dense
        />
        <q-toolbar-title class="absolute-center"> {{ getTitle }} </q-toolbar-title>
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
          v-else
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Sair"
          @click="sair"
        >
          {{ storeChatInstance?.userDetails?.name }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeChat } from 'src/store/store'

export default defineComponent({
  name: 'MainLayoutComponent',

  data() {
    const storeChatInstance = storeChat()

    return {
      storeChatInstance,
    }
  },

  computed: {
    getTitle(): string {
      const currentPath: string = this.$route.fullPath

      const titleMapper: Record<string, string> = {
        '/': 'Página Inicial',
        '/chat': 'Chat',
        '/auth': 'Login',
      }

      return titleMapper[currentPath] ?? 'Página Inicial'
    },
  },

  methods: {
    sair(): void {
      this.storeChatInstance.sair()
    },
  },
})
</script>
