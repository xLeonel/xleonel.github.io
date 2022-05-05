import { Injectable } from '@angular/core';
import { AulaModel } from '../models/aula-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Faltas } from '../models/faltas';

@Injectable({
  providedIn: 'root'
})
export class PresencaService {
  constructor(
    private http: HttpClient
  ) { }

  getAllByAluno() {
    return this.http.get<AulaModel[]>(`${environment.apiUrl}/presencas`);
  }

  cadastro(idAula: number) {
    return this.http.post(`${environment.apiUrl}/presencas`, { idaula: idAula });
  }

  getFaltasByAluno() {
    return this.http.get<Faltas>(`${environment.apiUrl}/presencas/faltas`);
  }

}
