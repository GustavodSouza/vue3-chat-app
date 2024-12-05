import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'

interface UsuarioInterface {
  nome: string
  email: string
  senha: string
}

export const storeChat = defineStore('store', {
  state: () => ({}),
  getters: {},
  actions: {
    registrarUsuario(novoUsuario: UsuarioInterface) {
      const auth = getAuth()

      // Inicialize o Firebase Auth e o Firebase Database
      const firebaseAuth = getAuth()
      const firebaseDb = getDatabase()

      createUserWithEmailAndPassword(auth, novoUsuario.email, novoUsuario.senha)
        .then(() => {
          const user = firebaseAuth.currentUser

          if (user) {
            const userId = user.uid

            // Usando a API modular do Firebase v9+
            const userRef = ref(firebaseDb, 'users/' + userId)
            set(userRef, {
              name: novoUsuario.nome,
              email: novoUsuario.email,
              online: true,
            })
          } else {
            console.log('Usuário não autenticado')
          }
        })
        .catch((error) => {
          console.log('Error', error)
        })
    },

    loginUsuario() {
      console.log('Login Usuario')
    },
  },
})
