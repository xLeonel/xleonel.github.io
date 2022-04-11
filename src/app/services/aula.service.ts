import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aula } from '../models/aula';

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

  getAllByProfessor(idProfessor: number) {
    return this.http.get<Aula[]>(`${environment.apiUrl}/aulas/professor/${idProfessor}`);
  }

  getAllByAluno(idAluno: number) {
    return this.http.get<Aula[]>(`${environment.apiUrl}/aulas/alunos/${idAluno}`);
  }

  register(aula: Aula) {
    return this.http.post(`${environment.apiUrl}/aulas`, aula);
  }

  update(id: any, params: any) {
    return this.http.put(`${environment.apiUrl}/aulas/${id}`, params);
  }

}
