<template>
  <q-form>
    <q-input
      v-if="tab === 'cadastro'"
      v-model="formulario.nome"
      class="q-mb-md"
      outlined
      label="Nome"
    />
    <q-input v-model="formulario.email" class="q-mb-md" outlined label="Email" />
    <q-input v-model="formulario.senha" class="q-mb-md" outlined type="password" label="Senha" />
    <div class="row justify-end">
      <q-btn color="primary" :label="tab === 'login' ? 'Login' : 'Cadastrar-se'" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'

export default defineComponent({
  name: 'LoginCadastroComponent',
  props: {
    tab: {
      type: String,
    },
  },

  data() {
    return {
      formulario: ref({
        nome: shallowRef<string>(''),
        email: shallowRef<string>(''),
        senha: shallowRef<string>(''),
      }),
    }
  },
})
</script>
