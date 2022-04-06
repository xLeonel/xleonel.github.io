import { Curso } from "./curso";
import { Materia } from "./materia";
import { User } from "./user";

export class Aula {
    constructor(
        public id: number,
        public professor: User,
        public curso: Curso,
        public materia: Materia,
        public inicio: Date,
        public fim: Date,
        public alunos: User[]
    ) { }
}