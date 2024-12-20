<template>
  <q-page v-if="!loadingChat" class="page-container flex column">
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
          @keydown.enter.prevent="enviarMensagem"
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
  <chat-skeleton-layout v-else />
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import { storeChat } from '../store/store'
import ChatSkeletonLayout from 'src/layouts/skeletons/ChatSkeletonLayout.vue'

export default defineComponent({
  name: 'ChatComponent',
  components: { ChatSkeletonLayout },
  data() {
    const storeChatInstance = storeChat()

    return {
      novaMensagem: shallowRef<string>(''),
      storeChatInstance,
      loadingChat: shallowRef<boolean>(false),
    }
  },

  async mounted() {
    this.loadingChat = true
    await this.storeChatInstance
      .buscarMensagens(this.$route.params.idOutroUsuario)
      .then((resp) => console.log(resp))

    setTimeout(() => {
      this.loadingChat = false
    }, 2000)
    this.scrollFimPagina()
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
      this.scrollFimPagina()
    },

    scrollFimPagina() {
      window.scrollTo({
        top: 500,
        behavior: 'smooth',
      })
    },
  },
})
</script>
<style lang="scss">
.page-container {
  background: #e2dfd5;
}
</style>
