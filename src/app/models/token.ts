import { TipoUser } from "./user";

export class Token {
    constructor(
        public token: string,
        public validade: string,
    ) { }
}

export class TokenModel {
    constructor(
        public idUser: number,
        public nomeCompleto: string,
        public tipoUsuario: TipoUser
    ) { }
}