import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Aula } from '../models/aula';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  constructor(
    private http: HttpClient
  ) { }

  getAllByProfessor(idProfessor: number) {
    return this.http.get<Aula[]>(`${environment.apiUrl}/aulas/${idProfessor}`);
  }

  register(aula: Aula) {
    return this.http.post(`${environment.apiUrl}/aulas`, aula);
  }
}
