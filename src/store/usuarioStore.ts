import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUsuario } from 'src/interface/UsuarioInterface'

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    usuarioLogado: ref<IUsuario>({
      name: '',
      email: '',
      uid: '',
    }),
  }),

  getters: {
    getUsuarioLogado(): IUsuario {
      return this.usuarioLogado
    },
  },

  actions: {
    setUsuarioLogado(usuarioLogado): void {
      if (usuarioLogado) {
        const { email, displayName, uid } = usuarioLogado

        this.usuarioLogado.name = displayName
        this.usuarioLogado.email = email
        this.usuarioLogado.uid = uid
      }
    },
  },
})
