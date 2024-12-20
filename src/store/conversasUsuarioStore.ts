import { defineStore } from 'pinia'

export const conversasUsuarioStore = defineStore('conversasUsuarioStore', {
  state: () => ({
    usuarios: {},
  }),

  getters: {
    getUsuariosConversa() {
      return this.usuarios
    },
  },

  actions: {
    setUsuariosConversa(usuarios: object) {
      this.usuarios = usuarios
    },
  },
})
