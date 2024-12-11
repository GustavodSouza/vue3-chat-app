<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeChat } from './store/store'

export default defineComponent({
  name: 'AppComponent',

  data() {
    const storeChatInstance = storeChat()

    return {
      storeChatInstance,
    }
  },

  mounted() {
    this.storeChatInstance.mudarStadoAutenticacao()
  },
})
</script>
