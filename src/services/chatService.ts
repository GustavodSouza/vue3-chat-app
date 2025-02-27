import { getDatabase, ref, push, onValue } from 'firebase/database'

const firebaseDb = getDatabase();

export const enviarMensagem = (payload, uidRemetente: string) => {
  
  const remetenteRef = ref(firebaseDb, 'chats/' + uidRemetente + '/' + payload.otherUserId)
  
  push(remetenteRef, payload.message)

  payload.message.from = 'them'

  const destinatarioRef = ref(firebaseDb, 'chats/' + payload.otherUserId + '/' + uidRemetente)
  
  push(destinatarioRef, payload.message)
}

export const buscarMensagens = (uidDestinatario: string, uidRemetente: string, callback) => {
  const chatRef = ref(firebaseDb, 'chats/' + uidRemetente + '/' + uidDestinatario)

  onValue(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  })

}