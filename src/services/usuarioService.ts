import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue, get, update, set } from 'firebase/database'

export const loginUsuario = (payload) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, payload.email, payload.senha);
};

export const cadastrarUsuarioAuthentication = (usuario: { email: string, senha: string, nome: string }) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, usuario.email, usuario.senha);
};

export const criarUsuarioDataBase = (usuario) => {
  const auth = getAuth();
  const firebaseDb = getDatabase();

  const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      const userRef = ref(firebaseDb, 'users/' + userId);

      return set(userRef, {
        name: usuario.nome,
        email: usuario.email,
        online: true,
      });
    }
};

export const getConversasUsuario = (callback) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, 'users/');

  // Observa mudanças no nó 'users' do Firebase
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  })
};

export const changeEstadoAutenticacao = (callback) => {
  const auth = getAuth();
  
  auth.onAuthStateChanged((response) => {
    callback(response);
  })
};

export const getUsuarioPorId = (url: string, callback) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, url);

  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  })
};

export const updateEstadoUsuario = (estado: boolean, idUsuario: string) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, 'users/' + idUsuario);

  update(userRef, {
    online: estado,
  })
};

export const getBatePapoPorId = (idRemetente: string, idDestinatario: string, callback) => {
  const firebaseDb = getDatabase();

  const userRef = ref(firebaseDb, 'chats/' + idRemetente + '/' + idDestinatario)

  return onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  })
};
