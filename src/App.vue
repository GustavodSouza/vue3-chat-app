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
    changeEstadoAutenticacao((usuario) => {
      console.log('Opaaa')
      const auth = getAuth()

      if (usuario) {
        const currentUser = auth.currentUser
        const userId = currentUser?.uid

        getUsuarioPorId(userId, (callback) => {
          const payload = {
            email: callback ? callback.email : currentUser.email,
            displayName: callback ? callback.name : '',
            uid: userId,
          }

          this.usuarioStoreInstance.setUsuarioLogado(payload)

          updateEstadoUsuario(true, userId)
        })
      } else {
        debugger
        // Ao realizar o logout verifica o uid do usuário que estava logado
        if (this.usuarioStoreInstance.getUsuarioLogado.uid) {
          // Então atualiza seu status para offline
          updateEstadoUsuario(false, this.usuarioStoreInstance.getUsuarioLogado.uid)
        }
      }
    })
  },
})
</script>
