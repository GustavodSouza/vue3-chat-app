import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue, get, update } from 'firebase/database'

export const loginUsuario = (payload) => {
  const auth = getAuth()
  return signInWithEmailAndPassword(auth, payload.email, payload.senha)
}

export const getConversasUsuario = (callback) => {
  const firebaseDb = getDatabase()
  const userRef = ref(firebaseDb, 'users/')

  // Observa mudanças no nó 'users' do Firebase
  return onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const usuarios = snapshot.val()
      callback(usuarios) // Executa a lógica definida pelo callback
    } else {
      callback(null) // Caso não existam dados
    }
  })
}

export const changeEstadoAutenticacao = (callback) => {
  const auth = getAuth()
  auth.onAuthStateChanged((response) => {
    callback(response)
  })
}

export const getUsuarioPorId = (url: string, callback) => {
  const firebaseDb = getDatabase()
  const userRef = ref(firebaseDb, url)

  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val()) // Executa a lógica definida pelo callback
    } else {
      callback(null) // Caso não existam dados
    }
  })
}

export const updateEstadoUsuario = (estado: boolean, idUsuario: string) => {
  const firebaseDb = getDatabase()
  const userRef = ref(firebaseDb, 'users/' + idUsuario)

  update(userRef, {
    online: estado,
  })
}
