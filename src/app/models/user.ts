import { Curso } from "./curso";
import { Periodo } from "./periodo";

export class User {
    id: number;
    email: string;
    senha: string;
    rgm: string;
    cpf: string;
    nome: string;
    sobrenome: string;
    tipoUsuario: TipoUser;
    token?: string;
    periodo: Periodo;
    curso: Curso[];
}

export enum TipoUser {
    aluno,
    professor,
    adm
}