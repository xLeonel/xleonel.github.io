import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { TipoUser, User } from '../../models/user';

@Component({
  selector: 'app-professores',
  templateUrl: './professores.component.html',
  styleUrls: ['./professores.component.css']
})
export class ProfessoresComponent implements OnInit {
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
    this.accountService.getAllByRole(TipoUser.professor)
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
