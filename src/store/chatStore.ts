import { defineStore } from 'pinia';
import { IChat } from 'src/interface/ChatInterface';
import { ref } from 'vue';

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    mensagens: ref<Array<IChat>>([]),
  }),
  
  getters: {
    getMensagens() {
      return this.mensagens;
    }
  },

  actions: {
    setMensagens(mensagens) {
      this.mensagens = mensagens;
    }
  },
})