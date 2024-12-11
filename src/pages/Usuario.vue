<template>
  <q-page class="flex q-pa-md">
    <q-list class="full-width" separator>
      <q-item
        v-for="(contact, key) in getUsuarios"
        :key="key"
        :to="'/chat/' + key"
        class="q-my-sm"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ contact.name ? contact.name.charAt(0) : '' }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.name }}</q-item-label>
          <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge :color="contact?.online ? 'light-green-5' : 'grey-4'">
            {{ contact.online ? 'Online' : 'Offline' }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeChat } from 'src/store/store'

interface UserDetails {
  name?: string
  email?: string
  userId?: string
  online?: string
  key?: string | undefined
}

export default defineComponent({
  name: 'UsuarioComponent',
  data() {
    const storeChatInstance = storeChat()
    return {
      storeChatInstance,
    }
  },

  computed: {
    getUsuarios(): Array<UserDetails> {
      return this.storeChatInstance.getUsuarios
    },
  },

  mounted() {
    this.storeChatInstance.buscarTodosUsuários()
  },
})
</script>
