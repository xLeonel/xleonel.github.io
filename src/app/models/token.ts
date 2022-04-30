import { TipoUser } from "./user";

export class TokenResponse {
    constructor(
        public token: string,
        public validade: string,
    ) { }
}

export class Token {
    constructor(
        public idUser: number,
        public nomeCompleto: string,
        public email: string,
        public tipoUsuario: TipoUser,
        public token: string
    ) { }
}