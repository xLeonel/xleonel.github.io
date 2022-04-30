import { Curso } from "./curso";
import { Periodo } from "./periodo";

export class User {
    constructor(
        public id: number,
        public email: string,
        public senha: string,
        public rgm: string,
        public cpf: string,
        public nome: string,
        public sobrenome: string,
        public tipoUsuario: TipoUser,
        public periodo: Periodo,
        public curso: Curso[],
        public isDeleting?: boolean,
        public token?: string,
    ) { }
}

export enum TipoUser {
    adm = 1,
    professor,
    aluno,
}