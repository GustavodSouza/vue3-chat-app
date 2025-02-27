export interface IUsuario {
  nome: string;
  email: string;
  uid?: string;
}

export interface IUsuariosRegistrados extends IUsuario {
  online: string
}
