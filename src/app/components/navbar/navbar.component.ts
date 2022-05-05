import { Component } from '@angular/core';
import { Token } from '../../models/token';
import { TipoUser } from '../../models/user';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  tipoAluno = TipoUser.aluno;
  tipoAdm = TipoUser.adm;
  tipoProf = TipoUser.professor;

  token!: Token;

  constructor(private accountService: AccountService) {
    this.accountService.token.subscribe(x => this.token = x);
  }

  logout() {
    this.accountService.logout();
  }

}
