export interface IUsuario {
  name: string
  email: string
  uid?: string
}

export interface IUsuariosRegistrados extends IUsuario {
  online: string
}
