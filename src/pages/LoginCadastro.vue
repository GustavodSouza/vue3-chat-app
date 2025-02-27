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
import { hideLoader, showLoader } from 'src/plugin/loaderPlugin';
import { notify } from 'src/plugin/notifyPlugin';
import type { IUsuario } from 'src/interface/UsuarioInterface';

import { 
  loginUsuario, 
  cadastrarUsuarioAuthentication, 
  criarUsuarioDataBase, 
  getUsuarioPorId, 
  // updatePerfilUsuario 
} from 'src/services/usuarioService';

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
        .then(async (response) => {

          await getUsuarioPorId(response.user.uid, (response: IUsuario) => {
            // const usuario = {
            //   email: response.email,
            //   displayName: response.nome,
            //   uid: response.uid
            // };

            this.usuarioStoreInstance.setUsuarioLogado(response)
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
      // 1º Obtém os dados do formulário;
      const usuario = {
        nome: this.formulario.nome,
        email: this.formulario.email,
        senha: this.formulario.senha
      };

      showLoader();

      // 2º Cria no authentication;
      await cadastrarUsuarioAuthentication(usuario).then(async (response) => {
        if (response) {
          // updatePerfilUsuario({ nome: usuario.nome }); // 3º Atualizo o displayName;
          this.registrarUsuarioNoRealTime(usuario, response.user.uid); // 4º Cria o usuário no RealTime;        
        }
      }).catch((error) => {
        console.error(error);

        if (error.code === 'auth/email-already-in-use') {
          notify('negative', 'Este email já esta cadastrado no sistema, faça login!');
        }
      }).finally(hideLoader);
    },

    registrarUsuarioNoRealTime(usuario: IUsuario, uidUser: string): void {
      const usuarioModel = {
        ...usuario,
        uid: uidUser
      }

      // 2º Criar no Database
      criarUsuarioDataBase(usuarioModel).then(() => {

        this.usuarioStoreInstance.setUsuarioLogado(usuarioModel)

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
