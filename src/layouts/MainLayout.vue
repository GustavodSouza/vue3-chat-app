<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="absolute-center"> {{ getTitle }} </q-toolbar-title>
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
