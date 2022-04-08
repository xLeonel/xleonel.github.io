import { Materia } from "./materia";

export class Curso {
    constructor(
        public id: number,
        public nome: string,
        public materias: Materia[]
    ) { }
}

