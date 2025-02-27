import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUsuario } from 'src/interface/UsuarioInterface'
import { getAuth } from 'firebase/auth'

export const usuarioStore = defineStore('usuarioStore', {
  state: () => ({
    usuarioLogado: ref<IUsuario>({
      nome: '',
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

    getContatos() {
      return this.usuarios
    },

    getUsuarioMensagens() {
      return this.mensagens
    },
  },

  actions: {
    setUsuarioLogado(usuarioLogado: IUsuario): void {
      if (usuarioLogado) {
        this.usuarioLogado = usuarioLogado;
      }
    },

    setContatos(usuarios: Array<IUsuario>) {
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
