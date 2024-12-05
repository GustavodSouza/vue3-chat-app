import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCmkC8PhtKrP6nthBwyfsoIJwYRSrsVpds',
  authDomain: 'vue-chat-app-1.firebaseapp.com',
  projectId: 'vue-chat-app-1',
  storageBucket: 'vue-chat-app-1.firebasestorage.app',
  messagingSenderId: '477167424059',
  appId: '1:477167424059:web:b9735b2f6640386164c21e',
  measurementId: 'G-YK7CHRZ84Y',
}

const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)
const firebaseDb = getDatabase(firebaseApp)

export { firebaseDb, firebaseAuth }
