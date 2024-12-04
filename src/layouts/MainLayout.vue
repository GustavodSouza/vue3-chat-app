<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row items-center">
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          icon="arrow_back"
          label="Voltar"
          flat
          dense
        />
        <q-toolbar-title class="absolute-center"> {{ getTitle }} </q-toolbar-title>

        <q-btn
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Login"
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

export default defineComponent({
  name: 'MainLayoutComponent',
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
})
</script>
