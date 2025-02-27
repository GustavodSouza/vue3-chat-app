import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import { getDatabase, ref, onValue, get, update, set, onChildChanged } from 'firebase/database'

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
        ...usuario,
        online: true,
        digitando: false
      });
    }
};

export const getContatos = (callback) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, 'users/');
  const auth = getAuth();

  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      
      const filteredUsers = Object.keys(users)
      .filter((uid) => uid !== auth.currentUser.uid)
      .map((uid) => ({
        uid,
        ...users[uid],
      }));

      callback(filteredUsers);
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

export const changeDataBase = (callback) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, "users/");

  onChildChanged(userRef, (snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    } 
  });
};

export const getUsuarioPorId = (uid: string, callback) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, `/users/${uid}`);

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

export const updateEstaDigitando = (estado: boolean, idUsuario: string) => {
  const firebaseDb = getDatabase();
  const userRef = ref(firebaseDb, 'users/' + idUsuario);

  update(userRef, {
    digitando: estado,
  })
};

export const updatePerfilUsuario = async (usuario) => {
  const auth = getAuth();

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: usuario.nome,
    });
  }
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
