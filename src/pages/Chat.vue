<template>
  <q-page class="flex column">
    <q-banner class="text-white bg-grey-4 text-center"> Usuário Offline. </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="mensagem in this.storeChatInstance.getMensagens"
        :key="mensagem.texto"
        :name="mensagem.from"
        :text="[mensagem.texto]"
        :sent="mensagem.from === 'me'"
      />
    </div>
    <q-footer class="q-pa-sm" elevated>
      <q-form>
        <q-input
          v-model="novaMensagem"
          bg-color="white"
          class="full-width"
          outlined
          rounded
          label="Mensagem"
          dense
        >
          <template v-slot:after>
            <q-btn @click="enviarMensagem" round dense flat color="white" icon="send" />
          </template>
        </q-input>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import { storeChat } from 'src/store/store'

export default defineComponent({
  name: 'ChatComponent',

  data() {
    const storeChatInstance = storeChat()

    return {
      novaMensagem: shallowRef<string>(''),
      storeChatInstance,
    }
  },

  mounted() {
    this.storeChatInstance.buscarMensagens(this.$route.params.idOutroUsuario)
  },

  unmounted() {
    this.storeChatInstance.pararBuscaMensagens()
  },

  methods: {
    enviarMensagem() {
      console.log('Mensagem enviada:', this.novaMensagem)
      // this.mensagens.push({
      //   texto: this.novaMensagem,
      //   from: 'me',
      // })
    },
  },
})
</script>
