<template>
  <div class="q-mt-lg">
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
          @click="autenticar"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'
import { usuarioStore } from 'src/store/usuarioStore'
import { loginUsuario } from 'src/services/usuarioService'

export default defineComponent({
  name: 'LoginCadastroComponent',
  props: {
    tab: {
      type: String,
    },
  },

  data() {
    const usuarioStoreInstance = usuarioStore()

    return {
      formulario: ref({
        nome: shallowRef<string>(''),
        email: shallowRef<string>(''),
        senha: shallowRef<string>(''),
      }),
      usuarioStoreInstance,
    }
  },

  // mounted() {
  //   if (this.storeChatInstance.userDetails?.name) {
  //     this.$router.push('/usuario')
  //   }
  // },

  methods: {
    autenticar(): void {
      const actions = {
        login: {
          acao: () => this.realizarLogin(),
        },
        cadastro: {
          acao: () => this.realizarCadastro(),
        },
      }

      actions[this.tab].acao()
    },

    async realizarLogin(): Promise<void> {
      await loginUsuario(this.formulario)
        .then((response) => {
          this.usuarioStoreInstance.setUsuarioLogado(response.user)
          this.$router.push('usuario')
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao realizar o login: ', error)
        })
        .finally()
    },

    async realizarCadastro(): Promise<void> {},

    validarInput(valor: string): boolean {
      return !!valor
    },
  },
})
</script>
