<template>
  <q-item>
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="cadastro" label="Cadastrar-se" />
      </q-tabs>
  
      <q-separator />
  
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-cadastro :tab="tab" />
        </q-tab-panel>
  
        <q-tab-panel name="cadastro">
          <login-cadastro :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

import LoginCadastro from './LoginCadastro.vue'

export default defineComponent({
  name: 'AuthComponent',

  components: {
    LoginCadastro,
  },

  data() {
    return {
      tab: shallowRef<string>('login'),
    }
  },
})
</script>
