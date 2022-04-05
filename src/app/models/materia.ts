import { Semestre } from "./semestre";

export class Materia {
    constructor(
        public id: number,
        public nome: string,
        public semestre: Semestre
    ) { }
}