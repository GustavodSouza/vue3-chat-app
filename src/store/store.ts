import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getDatabase, ref, set, get, update, onValue, off, push } from 'firebase/database'
import { useRouter } from 'vue-router'

interface UsuarioInterface {
  nome: string
  email: string
  senha: string
  userId: string
}

interface UserDetails {
  name?: string
  email?: string
  userId?: string
  online?: string
}

interface StateInterface {
  userDetails: UserDetails
  users: Array<UserDetails>
  messages: Array<UserDetails>
}

let mensagensRef

export const storeChat = defineStore('store', {
  state: (): StateInterface => ({
    userDetails: {},
    users: [],
    messages: [],
  }),
  getters: {
    getUsuarios() {
      const usuariosFiltrados = {}

      Object.keys(this.users).forEach((key) => {
        if (key !== this.userDetails.userId) {
          usuariosFiltrados[key] = this.users[key]
        }
      })

      return usuariosFiltrados
    },

    getMensagens() {
      return this.messages
    },
  },
  actions: {
    registrarUsuario(novoUsuario: UsuarioInterface) {
      const auth = getAuth()
      const firebaseDb = getDatabase()

      createUserWithEmailAndPassword(auth, novoUsuario.email, novoUsuario.senha)
        .then(() => {
          const user = auth.currentUser

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

    async loginUsuario(novoUsuario: UsuarioInterface) {
      const auth = getAuth()

      let sucesso = false

      await signInWithEmailAndPassword(auth, novoUsuario.email, novoUsuario.senha)
        .then((response) => {
          console.log(response)
          sucesso = true
        })
        .catch((error) => {
          console.log('Error', error)
        })

      return sucesso
    },

    mudarStadoAutenticacao() {
      // debugger
      const router = useRouter()
      const auth = getAuth()
      const firebaseDb = getDatabase()

      auth.onAuthStateChanged((userResponse) => {
        // debugger
        if (userResponse) {
          const currentUser = auth.currentUser

          if (currentUser) {
            const userId = currentUser.uid

            const userRef = ref(firebaseDb, 'users/' + userId)

            get(userRef).then((snapshot) => {
              if (snapshot.exists()) {
                const userDetails = snapshot.val()

                this.setDetalhesUsuario({
                  name: userDetails.name,
                  email: userDetails.email,
                  userId: userId,
                })

                update(userRef, {
                  online: true,
                })

                // router.push('/')
              }
            })
          }
        } else {
          if (this.userDetails.userId) {
            const userRef = ref(firebaseDb, 'users/' + this.userDetails.userId)

            update(userRef, {
              online: false,
            })

            this.setDetalhesUsuario({})
          }
          router.replace('/auth')
        }
      })
    },

    async buscarTodosUsuários() {
      const firebaseDb = getDatabase()
      const userRef = ref(firebaseDb, 'users/')

      return onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userDetails = snapshot.val()
          this.users = userDetails
        }
      })
    },

    async buscarMensagens(idOutroUsuario: string) {
      const userId = this.userDetails.userId
      const firebaseDb = getDatabase()

      const userRef = ref(firebaseDb, 'chats/' + userId + '/' + idOutroUsuario)

      mensagensRef = userRef

      return onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userMessages = snapshot.val()
          this.messages = userMessages
        }
      })
    },

    pararBuscaMensagens() {
      if (mensagensRef) {
        off(mensagensRef)
        this.limparMensagens()
      }
    },

    enviarMensagem(payload) {
      const userId = this.userDetails.userId
      const firebaseDb = getDatabase()

      const userRef = ref(firebaseDb, 'chats/' + userId + '/' + payload.otherUserId)
      push(userRef, payload.message)

      payload.message.from = 'them'

      const outroUserRef = ref(firebaseDb, 'chats/' + payload.otherUserId + '/' + userId)
      push(outroUserRef, payload.message)
    },

    limparMensagens() {
      this.messages = []
    },

    setDetalhesUsuario(payload) {
      this.userDetails = payload
    },

    sair() {
      const auth = getAuth()
      auth.signOut()
    },
  },
})
