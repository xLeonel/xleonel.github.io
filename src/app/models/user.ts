export class User {
    id: number;
    email: string;
    senha: string;
    rgm: string;
    cpf: string;
    nome: string;
    sobrenome: string;
    tipoUsuario: TipoUser
    token?: string;
}

export enum TipoUser {
    aluno,
    professor,
    adm
}