<template>
  <q-form ref="formulario">
    <q-input
      v-if="tab === 'cadastro'"
      v-model="formulario.nome"
      class="q-mb-md"
      outlined
      label="Nome"
      :rules="[validarInput]"
    />
    <q-input
      v-model="formulario.email"
      class="q-mb-md"
      outlined
      label="Email"
      :rules="[validarInput]"
    />
    <q-input
      v-model="formulario.senha"
      class="q-mb-md"
      outlined
      type="password"
      label="Senha"
      :rules="[validarInput]"
    />
    <div class="row justify-end">
      <q-btn
        color="primary"
        :label="tab === 'login' ? 'Login' : 'Cadastrar-se'"
        @click="enviarFormulario"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'
import { storeChat } from 'src/store/store'

export default defineComponent({
  name: 'LoginCadastroComponent',
  props: {
    tab: {
      type: String,
    },
  },

  data() {
    const storeChatInstance = storeChat()

    return {
      formulario: ref({
        nome: shallowRef<string>(''),
        email: shallowRef<string>(''),
        senha: shallowRef<string>(''),
      }),
      storeChatInstance,
    }
  },

  methods: {
    enviarFormulario(): void {
      if (this.tab === 'cadastro') {
        this.storeChatInstance.registrarUsuario(this.formulario)
      } else {
        this.storeChatInstance.loginUsuario(this.formulario)
      }
    },

    validarInput(valor: string): boolean {
      return !!valor
    },
  },
})
</script>
