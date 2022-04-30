import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { Aula } from '../../models/aula';
import { formatDate } from '@angular/common';
import { Token } from '../../models/token';

@Component({
  selector: 'app-presenca',
  templateUrl: './presenca.component.html',
  styleUrls: ['./presenca.component.css']
})
export class PresencaComponent implements OnInit {
  private aulas: Aula[] = [];
  private aulasSemestres: Aula[] = [];
  private token!: Token;

  aulasFiltered: Aula[] = [];
  filterBy!: string;

  notFound = false;

  numeroFalta = 0;
  zeroFaltas = false;
  carregado = false;

  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('/') || this.isNum(this.filterBy)) {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => formatDate(aula.inicio, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1 || formatDate(aula.fim, 'dd/MM/yyyy', 'en-US').indexOf(this.filterBy) > -1)
      .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
    else {
      this.aulasFiltered = this.aulas.filter((aula: Aula) => aula.materia.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1 || aula.professor.nome.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) > -1)
      .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService) { this.accountService.token.subscribe(x => this.token = x) }

  ngOnInit() {
    this.aulasService.getAllByAluno(this.token.idUser).subscribe({
      next: aulas => {
        this.aulas = aulas;
        this.aulasFiltered = this.aulas.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

        // this.aulasService.getAulaBySemestre(this.user.semestre).subscribe({
        //   next: aulasSemestre => {
        //     this.aulasSemestres = aulasSemestre;
    
        //     let quantidadeFalta = this.aulasSemestres.length - this.aulas.length;
            
        //     this.numeroFalta = quantidadeFalta;

        //     if (this.numeroFalta === 0) {
        //       this.zeroFaltas = true;
        //     }

        //     this.carregado = true;
        //   },
        //   error: e => {
        //     this.alertService.error(e);
        //   }
        // });
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
