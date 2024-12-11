<template>
  <q-page class="page-container flex column">
    <q-banner v-if="!getInformacoesOutroUsuario.online" class="text-white bg-grey-4 text-center">
      {{ getInformacoesOutroUsuario.name }} está offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="mensagem in this.storeChatInstance.getMensagens"
        :key="mensagem.texto"
        :name="
          mensagem.from === 'me'
            ? storeChatInstance.userDetails.name
            : getInformacoesOutroUsuario.name
        "
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
          @keydown.enter="enviarMensagem"
        >
          <template v-slot:after>
            <q-btn
              @click="enviarMensagem"
              round
              dense
              flat
              color="white"
              icon="send"
              :disable="!novaMensagem"
            />
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

  computed: {
    getInformacoesOutroUsuario() {
      if (this.storeChatInstance.users[this.$route.params.idOutroUsuario]) {
        return this.storeChatInstance.users[this.$route.params.idOutroUsuario]
      }
      return {}
    },
  },

  methods: {
    enviarMensagem() {
      this.storeChatInstance.enviarMensagem({
        message: {
          texto: this.novaMensagem,
          from: 'me',
        },
        otherUserId: this.$route.params.idOutroUsuario,
      })

      this.novaMensagem = ''
    },
  },
})
</script>
<style lang="scss">
.page-container {
  background: #e2dfd5;
}
</style>
