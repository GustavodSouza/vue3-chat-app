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
import { loginUsuario, cadastrarUsuarioAuthentication, criarUsuarioDataBase, getUsuarioPorId } from 'src/services/usuarioService'
import { hideLoader, showLoader } from 'src/plugin/loaderPlugin';
import { notify } from 'src/plugin/notifyPlugin';
import type { IUsuario } from 'src/interface/UsuarioInterface';

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

      debugger
      await loginUsuario(this.formulario)
        .then(async (response) => {

          await getUsuarioPorId(response.user.uid, (response: IUsuario) => {
            const usuario = {
              email: response.email,
              displayName: response.name,
              uid: response.uid
            };

            this.usuarioStoreInstance.setUsuarioLogado(usuario)
            this.$router.push('/conversas-usuario')
          });
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao realizar o login: ', error.code)
          
          if (error.code === 'auth/invalid-credential') {
            notify('negative', 'Credenciais inválidas!');
          }
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
        debugger
        if (response) {
          this.registrarUsuarioNoRealTime(usuario, response.user.uid);          
        }
      }).catch((error) => {
        console.error(error);

        if (error.code === 'auth/email-already-in-use') {
          notify('negative', 'Este email já esta cadastrado no sistema, faça login!');
        }
      }).finally(hideLoader);
    },

    registrarUsuarioNoRealTime(usuario, uidUsuario): void {
      debugger
      const usuarioPayload = {
        email: usuario.email,
        displayName: usuario.nome,
        uid: uidUsuario
      };

      // 2º Criar no Database
      criarUsuarioDataBase(usuario).then(() => {
        this.usuarioStoreInstance.setUsuarioLogado(usuarioPayload)

        notify('positive', 'Conta criada com sucesso!');
        this.$router.push('/conversas-usuario');
      })
      .catch((error) => {
        console.error(error);
        notify('negative', 'Ocorreu um erro ao criar a conta no Real Time Database');
      })
    },

    validarInput(valor: string): boolean {
      return !!valor
    },
  },
})
</script>
