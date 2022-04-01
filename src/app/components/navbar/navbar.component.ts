import { Component, OnInit } from '@angular/core';
import { TipoUser, User } from '../../models/user';
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

  user: User;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }

}
