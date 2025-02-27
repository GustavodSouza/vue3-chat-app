<template>
  <q-list v-if="getContatos.length" class="full-width" separator>
    <q-item
      v-for="(usuario, index) in getContatos"
      :key="index"
      :to="'/chat/' + usuario.uid"
      class="q-my-sm"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
          {{ usuario.nome ? usuario.nome.charAt(0) : '' }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ usuario.nome }}</q-item-label>
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

import { getContatos } from 'src/services/usuarioService'

import type { IUsuario, IUsuariosRegistrados } from 'src/interface/UsuarioInterface'

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
    getContatos(): Array<IUsuariosRegistrados> {
      return [...this.usuarioStoreInstance.getContatos].map(([uid, value]) => ({
        ...value,
        uid
      }));
    },
  },

  mounted() {
    this.obterConversasUsuario();
  },

  methods: {
    async obterConversasUsuario(): Promise<void> {
      this.loadingPaginaUsuario = true
      
      getContatos((usuarios: IUsuario) => {
        // 1º Limpa o new Map;
        this.usuarioStoreInstance.usuarios.clear();
        
        // 2º Setar a lista de usuários;
        this.usuarioStoreInstance.setContatos(usuarios);
        this.loadingPaginaUsuario = false;
      })
    },
  },
})
</script>
