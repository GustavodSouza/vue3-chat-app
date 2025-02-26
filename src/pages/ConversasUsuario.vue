<template>
  <q-list v-if="getUsuarios.length" class="full-width" separator>
    <q-item
      v-for="(usuario, index) in getUsuarios"
      :key="index"
      :to="'/chat/' + usuario.uid"
      class="q-my-sm"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
          {{ usuario.name ? usuario.name.charAt(0) : '' }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ usuario.name }}</q-item-label>
        <q-item-label caption lines="1">{{ usuario.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-badge :color="usuario?.online ? 'light-green-5' : 'grey-4'">
          {{ usuario.online ? 'Online' : 'Offline' }}
        </q-badge>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import { usuarioStore } from 'src/store/usuarioStore'

import { getConversasUsuario } from 'src/services/usuarioService'


import type { IUsuario, IUsuariosRegistrados } from 'src/interface/UsuarioInterface'

import { converterObjetoEmArray } from 'src/helpers/conversor-helpers'

export default defineComponent({
  name: 'ConversasUsuario',
  
  components: { 
  },
  
  data() {
    const usuarioStoreInstance = usuarioStore()

    return {
      usuarioStoreInstance,
      loadingPaginaUsuario: shallowRef<boolean>(false),
    }
  },

  computed: {
    getUsuarios(): Array<IUsuariosRegistrados> {
      // Elimina o usuario logado da lista
      this.usuarioStoreInstance.getUsuariosConversa.delete(this.usuarioStoreInstance.getUsuarioLogado.uid)

      return [...this.usuarioStoreInstance.getUsuariosConversa].map(([uid, value]) => ({
        ...value,
        uid
      }));
    },
  },

  mounted() {
    this.obterConversasUsuario()
  },

  methods: {
    async obterConversasUsuario(): Promise<void> {
      this.loadingPaginaUsuario = true
      
      getConversasUsuario((usuarios: IUsuario) => {
        let usuariosList = null

        if (usuarios) {
          usuariosList = converterObjetoEmArray(usuarios)
        }

        this.usuarioStoreInstance.setUsuariosConversa(usuariosList)
        this.loadingPaginaUsuario = false
      })
    },
  },
})
</script>
