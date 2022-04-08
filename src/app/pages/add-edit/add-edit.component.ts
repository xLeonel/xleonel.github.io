import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TipoUser } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  form: any;
  loading = false;
  submitted = false;
  isAddMode = false;;
  tipoExibicao: any;

  private id: any;

  get isAluno() {
    return this.tipoExibicao === TipoUser.aluno;
  }

  get isProfessor() {
    return this.tipoExibicao === TipoUser.professor;
  }

  //get form fields
  get formulario() { return this.form.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.route.data.subscribe(data => {
      this.tipoExibicao = data['tipoExibicao'];
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    //password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    if (this.isAluno) {
      this.form = this.formBuilder.group({
        nome: ['', [Validators.required]],
        sobrenome: ['', [Validators.required]],
        rgm: ['', [Validators.required, Validators.minLength(8)]],
        cpf: ['', [Validators.required, Validators.minLength(11)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', passwordValidators],
        tipoUsuario: [TipoUser.aluno, Validators.required],
      });
    }
    else if (this.isProfessor) {

      this.form = this.formBuilder.group({
        nome: ['', [Validators.required]],
        sobrenome: ['', [Validators.required]],
        rgm: ['', [Validators.required, Validators.minLength(8)]],
        cpf: ['', [Validators.required, Validators.minLength(11)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', passwordValidators],
        tipoUsuario: [TipoUser.professor, Validators.required],
      });
    }

    if (!this.isAddMode) {
      this.getUserById();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private getUserById() {
    this.accountService.getById(this.id)
      .pipe(first())
      .subscribe(
        user => {
          this.formulario['nome'].setValue(user.nome);
          this.formulario['sobrenome'].setValue(user.sobrenome);
          this.formulario['rgm'].setValue(user.rgm);
          this.formulario['cpf'].setValue(user.cpf);
          this.formulario['email'].setValue(user.email);
        },
        error => {
          this.alertService.error(error);
        });
  }

  private createUser() {
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success('Cadastrado com sucesso', { keepAfterRouteChange: true });
          this.router.navigate([this.isAluno ? '/alunos' : '/professores']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  private updateUser() {
    this.accountService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        () => {
          this.alertService.success('Atualizado com sucesso', { keepAfterRouteChange: true });
          this.router.navigate([this.isAluno ? '/alunos' : '/professores']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}