import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { TipoUser, User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css']
})
export class AlunosComponent implements OnInit {
  private usuarios: User[] = [];

  usuarioFiltered: User[] = [];
  filterBy!: string;

  notFound = false;

  set filter(value: string) {
    this.filterBy = value;

    if (this.filterBy.includes('@')) {
      this.usuarioFiltered = this.usuarios.filter((user: User) => user.email.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    }
    else if (this.filterBy.length <= 8 && this.isNum(this.filterBy)) {
      this.usuarioFiltered = this.usuarios.filter((user: User) => user.rgm.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    }
    else if (this.filterBy.length > 8 && this.isNum(this.filterBy)) {
      this.usuarioFiltered = this.usuarios.filter((user: User) => user.cpf.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    }
    else {
      this.usuarioFiltered = this.usuarios.filter((user: User) => user.nome.toLocaleLowerCase().indexOf(this.filterBy.toLowerCase()) > -1);
    }
  }

  get filter() {
    return this.filterBy;
  }

  constructor(private accountService: AccountService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getAllByRole();
  }

  deleteUser(id: number) {
    const user = <any>this.usuarioFiltered.find(u => u.id === id);
    user.isDeleting = true;

    this.accountService.delete(id)
      .pipe(first())
      .subscribe(
        () => {
          this.getAllByRole();
        },
        error => {
          this.alertService.error(error);
        });

  }

  private getAllByRole() {
    this.accountService.getAllByRole(TipoUser.aluno)
      .pipe(first())
      .subscribe(
        users => {
          if (users.length == 0) {
            this.notFound = true;
          }

          this.usuarios = users;
          this.usuarioFiltered = this.usuarios;
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
