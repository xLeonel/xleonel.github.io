import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { Aula } from '../../models/aula';
import { formatDate } from '@angular/common';
import { Token } from '../../models/token';
import { AulaModel } from 'src/app/models/aula-model';
import { PresencaService } from '../../services/presenca.service';

@Component({
  selector: 'app-presenca',
  templateUrl: './presenca.component.html',
  styleUrls: ['./presenca.component.css']
})
export class PresencaComponent implements OnInit {
  private aulas: AulaModel[] = [];
  private token!: Token;

  aulasFiltered: AulaModel[] = [];
  filterBy!: string;

  notFound = false;

  numeroFalta = 0;
  carregado = false;

  apiFaltasCarregada = false;

  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('/') || this.isNum(this.filterBy)) {
      this.aulasFiltered = this.aulas.filter((aula: AulaModel) => formatDate(aula.inicio, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1 || formatDate(aula.fim, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1)
        .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
    else {
      this.aulasFiltered = this.aulas.filter((aula: AulaModel) => aula.materia.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1 || aula.nomeProfessor.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1)
        .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private presencaService: PresencaService,
    private alertService: AlertService) { this.accountService.token.subscribe(x => this.token = x) }

  ngOnInit() {
    this.presencaService.getAllByAluno().subscribe({
      next: aulas => {
        this.aulas = aulas;
        this.aulasFiltered = this.aulas.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

        this.presencaService.getFaltasByAluno().subscribe({
          next: objFaltas => {
            this.carregado = true;
            this.apiFaltasCarregada = true;

            this.numeroFalta = objFaltas.totalFaltas;

          },
          error: e => {
            this.carregado = true;
            this.apiFaltasCarregada = true;

            this.alertService.error(e);
          }
        });
      },
      error: e => {
        this.alertService.error(e);
      }
    });
  }

  private isNum(value: string): boolean {
    return /^\d+$/.test(value);
  }
}
