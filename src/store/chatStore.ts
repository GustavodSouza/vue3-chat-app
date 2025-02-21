import { defineStore } from 'pinia'

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    mensagens: []
  }),
  
  getters: {
    getMensagens() {
      return this.mensagens
    }
  },

  actions: {
    setMensagens(mensagens) {
      this.mensagens = mensagens
    }
  }
})