import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AulaService } from '../../services/aula.service';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { formatDate } from '@angular/common';
import { Token } from '../../models/token';
import { AulaModel } from '../../models/aula-model';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  private aulas: AulaModel[] = [];
  private token!: Token;
  
  aulasFiltered: AulaModel[] = [];
  filterBy!: string;
  aulaModal!: AulaModel;

  notFound = false;
  exibirModal = false;
  carregado = false;

  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('/') || this.isNum(this.filterBy)) {
      this.aulasFiltered = this.aulas.filter((aula: AulaModel) => formatDate(aula.inicio, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1 || formatDate(aula.fim, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1)
        .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
    else {
      this.aulasFiltered = this.aulas.filter((aula: AulaModel) => aula.materia.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1 || aula.curso.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1)
        .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService) { this.accountService.token.subscribe(x => this.token = x); }

  ngOnInit() {
    this.aulasService.getAllByProfessor()
      .pipe(first())
      .subscribe(
        aulas => {
          this.carregado = true;

          if (aulas.length == 0) {
            this.notFound = true;
          }

          this.aulas = aulas;
          this.aulasFiltered = this.aulas.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
        },
        error => {
          this.carregado = true;
          
          this.alertService.error(error);
        });
  }

  private isNum(value: string): boolean {
    console.log(/^\d+$/.test(value))
    return /^\d+$/.test(value);
  }

  openModal(aula: AulaModel): void {
    this.aulaModal = aula;
  }
}