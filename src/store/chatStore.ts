import { defineStore } from 'pinia';
import type { IChat } from 'src/interface/ChatInterface';
import { ref } from 'vue';

export const chatStore = defineStore('chatStore', {
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

  persist: {
    storage: sessionStorage,
    key: 'chatStore',
  },
})