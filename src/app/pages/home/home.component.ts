import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { TipoUser, User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { Aula } from '../../models/aula';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  private aulas: Aula[];

  get isAluno() {
    return this.user.tipoUsuario === TipoUser.aluno;
  }

  get isProfessor() {
    return this.user.tipoUsuario === TipoUser.professor;
  }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
  
  }

  cadastrarAula() {
    
  }
}
