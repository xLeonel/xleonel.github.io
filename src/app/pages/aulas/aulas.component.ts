import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Aula } from '../../models/aula';
import { AulaService } from '../../services/aula.service';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  private aulas: Aula[] = [];
  private user: any;

  aulasFiltered: Aula[] = [];
  filterBy!: string;
  aulaModal!: Aula;

  notFound = false;
  exibirModal = false;
  
  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('/') || this.isNum(this.filterBy)) {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => formatDate(aula.inicio, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1 || formatDate(aula.fim, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1)
      .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
    else {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => aula.materia.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1 || aula.curso.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1)
      .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService) { this.accountService.user.subscribe(x => this.user = x) }

  ngOnInit() {
    this.aulasService.getAllByProfessor(this.user.id)
      .pipe(first())
      .subscribe(
        aulas => {
          if (aulas.length == 0) {
            this.notFound = true;
          }

          this.aulas = aulas;
          this.aulasFiltered = this.aulas.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
        },
        error => {
          this.alertService.error(error);
        });
  }

  private isNum(value: string): boolean {
    console.log(/^\d+$/.test(value))
    return /^\d+$/.test(value);
  }

  openModal(aula: Aula): void {
    this.aulaModal = aula;
  }
}