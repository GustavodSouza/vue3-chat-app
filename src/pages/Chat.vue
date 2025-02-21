<template>
  <q-page v-if="!loadingChat" class="page-container flex column">
    <q-banner v-if="!getInformacoesOutroUsuario.online" class="text-white bg-grey-4 text-center">
      {{ getInformacoesOutroUsuario.name }} está offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="mensagem in mensagens"
        :key="mensagem.texto"
        :name="
          mensagem.from === 'me'
            ? getInformacoesUsuarioLogado
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

import { usuarioStore } from 'src/store/usuarioStore'

import { buscarMensagens, enviarMensagem } from 'src/services/chatService'

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
    }
  },

  async mounted() {
    this.buscarMensagens()
  },

  computed: {
    getInformacoesUsuarioLogado() {
      return this.usuarioStoreInstance.getUsuarioLogado.name
    },

    getInformacoesOutroUsuario() {
      return this.usuarioStoreInstance.usuarios.get(this.$route.params.idOutroUsuario)
    },
  },

  methods: {
    async buscarMensagens(): Promise<void> {
      this.loadingChat = true

      const uidDestinatario = this.$route.params.idOutroUsuario
      const uidRemetente = this.usuarioStoreInstance.getUsuarioLogado.uid

      buscarMensagens(uidDestinatario, uidRemetente, (callback) => {
        this.mensagens = converterObjetoEmArray(callback)
        this.loadingChat = false
      })
    },

    async enviarMensagem(): Promise<void> {
      const uidRemetente = this.usuarioStoreInstance.getUsuarioLogado.uid

      const payload = {
        message: {
          texto: this.novaMensagem,
          from: 'me',
        },
        otherUserId: this.$route.params.idOutroUsuario
      }

      enviarMensagem(payload, uidRemetente)
      
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
