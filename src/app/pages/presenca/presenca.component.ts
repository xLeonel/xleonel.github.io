import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { Aula } from '../../models/aula';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-presenca',
  templateUrl: './presenca.component.html',
  styleUrls: ['./presenca.component.css']
})
export class PresencaComponent implements OnInit {
  private aulas: Aula[] = [];
  private aulasSemestres: Aula[] = [];
  private user: any;

  aulasFiltered: Aula[] = [];
  filterBy!: string;

  notFound = false;

  numeroFalta = 0;
  zeroFaltas = false;

  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('/') || this.isNum(this.filterBy)) {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => formatDate(aula.inicio, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1 || formatDate(aula.fim, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1);
    }
    else {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => aula.materia.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1 || aula.professor.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1);
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService) { this.accountService.user.subscribe(x => this.user = x) }

  ngOnInit() {
    this.aulasService.getAllByAluno(this.user.id).subscribe({
      next: aulas => {
        this.aulas = aulas;
        this.aulasFiltered = this.aulas;

        this.aulasService.getAulaBySemestre(this.user.semestre).subscribe({
          next: aulasSemestre => {
            this.aulasSemestres = aulasSemestre;
    
            let quantidadeFalta = this.aulasSemestres.length - this.aulas.length;
            
            this.numeroFalta = quantidadeFalta;

            if (this.numeroFalta === 0) {
              this.zeroFaltas = true;
            }
          },
          error: e => {
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
