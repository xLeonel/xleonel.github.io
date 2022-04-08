import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Aula } from '../../models/aula';
import { User } from '../../models/user';
import { AulaService } from '../../services/aula.service';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';

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

  notFound = false;

  set filter(value: string) {
    this.filterBy = value;

    // if (this.filterBy.includes('@')) {
    //   this.aulasFiltered = this.aulas.filter((aula: Aula) => user.email.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    // }
    // else if (this.filterBy.length <= 8 && this.isNum(this.filterBy)) {
    //   this.aulasFiltered = this.aulas.filter((user: User) => user.rgm.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    // }
    // else if (this.filterBy.length > 8 && this.isNum(this.filterBy)) {
    //   this.aulasFiltered = this.aulas.filter((user: User) => user.cpf.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    // }
    // else {
    //   this.aulasFiltered = this.aulas.filter((user: User) => user.nome.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    // }
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

        console.log(aulas)
        this.aulas = aulas;
        this.aulasFiltered = this.aulas;
      },
      error => {
        this.alertService.error(error);
      });
  }

  private isNum(value: string): boolean {
    console.log(/^\d+$/.test(value))
    return /^\d+$/.test(value);
  }
}