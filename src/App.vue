<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usuarioStore } from 'src/store/usuarioStore'

import {
  changeEstadoAutenticacao,
  getUsuarioPorId,
  updateEstadoUsuario,
} from 'src/services/usuarioService'

import { getAuth } from 'firebase/auth'

export default defineComponent({
  name: 'AppComponent',

  data() {
    const usuarioStoreInstance = usuarioStore()

    return {
      usuarioStoreInstance,
    }
  },

  mounted() {
    // // Acionado todo momento em que há alteração na base
    changeEstadoAutenticacao((usuario) => {
      const auth = getAuth()

      if (usuario) {
        const currentUser = auth.currentUser
        const userId = currentUser?.uid

        if (currentUser) {
          updateEstadoUsuario(true, userId)
        }

        getUsuarioPorId(userId, (callback) => {
          this.usuarioStoreInstance.setUsuarioLogado(callback)
        })
        
      } else {
        // Ao realizar o logout verifica o uid do usuário que estava logado
        if (this.usuarioStoreInstance.getUsuarioLogado.uid) {
          // Então atualiza seu status para offline
          updateEstadoUsuario(false, this.usuarioStoreInstance.getUsuarioLogado.uid)
        }
      }
    })
  },

  unmounted() {
    updateEstadoUsuario(false, this.usuarioStoreInstance.getUsuarioLogado.uid)
  }
})
</script>
