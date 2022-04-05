import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  constructor(
    private http: HttpClient
  ) { }
  
  getAll() {
    return this.http.get<Curso[]>(`${environment.apiUrl}/cursos`);
  }
}
