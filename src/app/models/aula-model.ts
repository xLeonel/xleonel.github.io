export class AulaModel {
    constructor(
        public idAula: number,
        public inicio: string,
        public fim: string,
        public nomeProfessor: string,
        public curso: string,
        public materia: string,
        public presencas: PresencaViewModel[]
    ) { }
}

export class PresencaViewModel {
    constructor(
        public idAluno: number,
        public nomeAluno: string
    ) { }
}