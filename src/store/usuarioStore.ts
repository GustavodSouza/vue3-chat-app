import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUsuario } from 'src/interface/UsuarioInterface'
import { getAuth } from 'firebase/auth'

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    usuarioLogado: ref<IUsuario>({
      name: '',
      email: '',
      uid: '',
    }),
    usuarios: new Map(),
    mensagens: {},
  }),

  getters: {
    getUsuarioLogado(): IUsuario {
      return this.usuarioLogado
    },

    getUsuariosConversa() {
      return this.usuarios
    },

    getUsuarioMensagens() {
      return this.mensagens
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

    setUsuariosConversa(usuarios: Array<IUsuario>) {
      usuarios.forEach((usuario: IUsuario) => {
        this.usuarios.set(usuario.uid, usuario)
      })
    },

    setUsuarioMensagens(mensagens) {
      this.mensagens = mensagens
    },

    logout() {
      const auth = getAuth()
      auth.signOut()
    }
  },
})
