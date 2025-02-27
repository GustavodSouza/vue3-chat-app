<template>
  <q-page v-if="!loadingChat" class="page-container flex column">
    <q-banner v-if="!getUsuarioDestinatario?.online" class="text-white bg-grey-6 text-center">
      {{ getUsuarioDestinatario?.name }} está offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="mensagem in mensagens"
        :key="mensagem.texto"
        :name="
          mensagem.from === 'me'
            ? getUsuarioLogado.name
            : getUsuarioDestinatario.name
        "
        :text="[mensagem.texto]"
        :sent="mensagem.from === 'me'"
      />
      <span v-if="showDigitando">Digitando...</span>
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
          @update:model-value="usuarioDigitando"
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

import { usuarioStore } from 'src/store/usuarioStore'

import { buscarMensagens, enviarMensagem } from 'src/services/chatService'
import { updateEstaDigitando, changeDataBase } from 'src/services/usuarioService'

import ChatSkeletonLayout from 'src/layouts/skeletons/ChatSkeletonLayout.vue'

import { converterObjetoEmArray } from 'src/helpers/conversor-helpers'

export default defineComponent({
  name: 'ChatComponent',
  
  components: { ChatSkeletonLayout },
  
  data() {
    const usuarioStoreInstance = usuarioStore()

    return {
      novaMensagem: shallowRef<string>(''),
      loadingChat: shallowRef<boolean>(false),
      mensagens: [],
      usuarioStoreInstance,
      typingTimeout: null,
      showDigitando: false,
    }
  },

  async mounted() {
    this.buscarMensagens()
    this.changeDataBaseUsuario()
  },

  computed: {
    getUsuarioLogado() {
      return this.usuarioStoreInstance.getUsuarioLogado
    },

    getUsuarioDestinatario() {
      return this.usuarioStoreInstance.usuarios.get(this.$route.params.idOutroUsuario)
    },
  },

  methods: {
    async buscarMensagens(): Promise<void> {
      this.loadingChat = true

      debugger
      buscarMensagens(this.getUsuarioDestinatario.uid, this.getUsuarioLogado.uid, (callback) => {
        if (callback) {
          this.mensagens = converterObjetoEmArray(callback)
        }

        this.loadingChat = false
      })
    },

    async enviarMensagem(): Promise<void> {
      const payload = {
        message: {
          texto: this.novaMensagem,
          from: 'me',
        },
        otherUserId: this.$route.params.idOutroUsuario
      }

      enviarMensagem(payload, this.getUsuarioLogado.uid)
      
      this.novaMensagem = ''
      this.scrollFimPagina()
    },

    scrollFimPagina() {
      window.scrollTo({
        top: 500,
        behavior: 'smooth',
      })
    },

    usuarioDigitando(): void {
      debugger
      updateEstaDigitando(true, this.getUsuarioLogado.uid)

      // Limpa o timeout anterior
      clearTimeout(this.typingTimeout);

      // Define um novo timeout para detectar inatividade
      this.typingTimeout = setTimeout(() => {
        updateEstaDigitando(false, this.getUsuarioLogado.uid)
      }, 1000);
    },

    changeDataBaseUsuario() {
      changeDataBase((resp) => {
        this.showDigitando = resp.digitando && resp.name !== this.getUsuarioLogado.name
      })
    }
  },
})
</script>
<style lang="scss">
.page-container {
  background: #cece9a;
}
</style>
