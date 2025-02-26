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
        no-caps
        :label="tab === 'login' ? 'Logar' : 'Cadastrar-se'"
        @click="autenticar"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'
import { usuarioStore } from 'src/store/usuarioStore'
import { loginUsuario, cadastrarUsuarioAuthentication, criarUsuarioDataBase } from 'src/services/usuarioService'
import { hideLoader, showLoader } from 'src/plugin/loaderPlugin';

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
      showLoader()

      await loginUsuario(this.formulario)
        .then((response) => {
          this.usuarioStoreInstance.setUsuarioLogado(response.user)
          this.$router.push('/conversas-usuario')
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao realizar o login: ', error.code)
        })
        .finally(hideLoader)
    },

    async realizarCadastro(): Promise<void> {
      const usuario = {
        nome: this.formulario.nome,
        email: this.formulario.email,
        senha: this.formulario.senha
      };

      showLoader();

      // 1º Cria no authentication
      await cadastrarUsuarioAuthentication(usuario).then(async (response) => {
        if (response) {

          // 2º Criar no Database
          await criarUsuarioDataBase(usuario).then(() => {
            console.log('Usuário Criado com sucesso!');
            this.$router.push('/conversas-usuario');
          })
          .catch((error) => {
            console.error('Erro ao criar o usuário no dataBase: ', error);
          })
        }
      }).catch((error) => {
        console.error('Erro ao criar o usuário no autenthication: ', error);
      }).finally(hideLoader);
    },

    validarInput(valor: string): boolean {
      return !!valor
    },
  },
})
</script>
