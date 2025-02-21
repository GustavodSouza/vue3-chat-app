import { getDatabase, ref, push, onValue } from 'firebase/database'

export const enviarMensagem = (payload, uidRemetente) => {
  const userId = uidRemetente
  const firebaseDb = getDatabase()

  const userRef = ref(firebaseDb, 'chats/' + userId + '/' + payload.otherUserId)
  push(userRef, payload.message)

  payload.message.from = 'them'

  const outroUserRef = ref(firebaseDb, 'chats/' + payload.otherUserId + '/' + userId)
  push(outroUserRef, payload.message)
}

export const buscarMensagens = (uidDestinatario, uidRemetente, callback) => {
  const firebaseDb = getDatabase()

  const userRef = ref(firebaseDb, 'chats/' + uidRemetente + '/' + uidDestinatario)

  // mensagensRef = userRef
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  })

}