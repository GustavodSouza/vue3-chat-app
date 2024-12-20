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
      const auth = getAuth()

      if (usuario) {
        const currentUser = auth.currentUser
        const userId = currentUser?.uid

        const url = `users/${userId}`

        getUsuarioPorId(url, (callback) => {
          const payload = {
            email: callback.email,
            displayName: callback.name,
            uid: userId,
          }

          this.usuarioStoreInstance.setUsuarioLogado(payload)

          updateEstadoUsuario(true, userId)
        })
      } else {
        updateEstadoUsuario(false, this.usuarioStoreInstance.getUsuarioLogado.uid)
      }
    })
  },
})
</script>
