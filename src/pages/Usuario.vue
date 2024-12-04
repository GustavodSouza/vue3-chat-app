<template>
  <q-page class="flex q-pa-md">
    <q-list class="full-width" separator>
      <q-item v-for="contact in contacts" :key="contact.id" class="q-my-sm" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ contact.name.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.name }}</q-item-label>
          <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge :color="contact.online ? 'light-green-5' : 'grey-4'">
            {{ contact.online ? 'Online' : 'Offline' }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const contacts = [
  {
    id: 1,
    name: 'Gustavo de Souza',
    email: 'gustavosouza501@gmail.com',
    online: true,
  },
  {
    id: 2,
    name: 'Mallorie Alessandrini',
    email: 'malessandrini1@marketwatch.com',
    online: false,
  },
]

export default defineComponent({
  name: 'UsuarioComponent',
  data() {
    return {
      contacts,
    }
  },
})
</script>
