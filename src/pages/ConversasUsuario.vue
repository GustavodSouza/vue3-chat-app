<template>
  <q-page v-if="!loadingPaginaUsuario" class="flex">
    <q-list class="full-width" separator>
      <q-item
        v-for="(usuario, key) in getUsuarios"
        :key="key"
        :to="'/chat/' + key"
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
      <div class="q-pa-md absolute-bottom-right">
        <q-btn push color="primary" round icon="add" />
      </div>
    </q-list>
  </q-page>
  <chat-skeleton-layout v-else />
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import { usuarioStore } from 'src/store/usuarioStore'
import { conversasUsuarioStore } from 'src/store/conversasUsuarioStore'

import { getConversasUsuario } from 'src/services/usuarioService'
import ChatSkeletonLayout from 'src/layouts/skeletons/ChatSkeletonLayout.vue'
import type { IUsuario, IUsuariosRegistrados } from 'src/interface/UsuarioInterface'

export default defineComponent({
  name: 'ConversasUsuario',
  components: { ChatSkeletonLayout },
  data() {
    const conversasUsuarioStoreInstance = conversasUsuarioStore()
    const usuarioStoreInstance = usuarioStore()

    return {
      conversasUsuarioStoreInstance,
      usuarioStoreInstance,
      loadingPaginaUsuario: shallowRef<boolean>(false),
    }
  },

  computed: {
    getUsuarios(): Array<IUsuariosRegistrados> {
      const usuariosFiltrados = []

      Object.keys(this.conversasUsuarioStoreInstance.getUsuariosConversa).forEach((key) => {
        if (key !== this.usuarioStoreInstance.getUsuarioLogado.uid) {
          usuariosFiltrados.push(this.conversasUsuarioStoreInstance.getUsuariosConversa[key])
        }
      })

      return usuariosFiltrados
    },
  },

  mounted() {
    this.obterConversasUsuario()
  },

  methods: {
    async obterConversasUsuario(): Promise<void> {
      getConversasUsuario((usuarios: IUsuario) => {
        this.conversasUsuarioStoreInstance.setUsuariosConversa(usuarios)
      })
    },
  },
})
</script>
