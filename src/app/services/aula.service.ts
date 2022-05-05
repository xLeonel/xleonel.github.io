import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Aula } from '../models/aula';
import { AulaModel } from '../models/aula-model';
import { Semestre } from '../models/semestre';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  constructor(
    private http: HttpClient
  ) { }

  getAulaById(idAula: number) {
    return this.http.get<Aula[]>(`${environment.apiUrl}/aulas/${idAula}`);
  }


  getAllByProfessor() {
    return this.http.get<AulaModel[]>(`${environment.apiUrl}/aulas`);
  }

  cadastro(aula: any) {
    //get time now e add as horas/minutos e formatar padrao americano 
    // let horaFim = new Date(Date.now());
    // horaFim.setHours(horaFim.getHours() + parseInt(aula.dateFim.split(':')[0]));
    // horaFim.setMinutes(horaFim.getMinutes() + parseInt(aula.dateFim.split(':')[1]));
    // horaFim.setSeconds(0);

    let aulaModel = {
      fim: aula.dateFim,
      idCurso: aula.curso.id,
      idMateria: aula.materia.id
    };

    return this.http.post<AulaModel>(`${environment.apiUrl}/aulas`, aulaModel);
  }

  update(id: any, params: any) {
    return this.http.put(`${environment.apiUrl}/aulas/${id}`, params);
  }
}
