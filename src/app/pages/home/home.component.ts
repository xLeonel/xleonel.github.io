import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { TipoUser, User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { Aula } from '../../models/aula';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Materia } from 'src/app/models/materia';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private aulas: Aula[];

  materias: Materia[] = [];
  user: User;
  form: FormGroup;
  loading = false;
  submitted = false;

  get isAluno() {
    return this.user.tipoUsuario === TipoUser.aluno;
  }

  get isProfessor() {
    return this.user.tipoUsuario === TipoUser.professor;
  }

  //get form fields
  get formulario() { return this.form.controls; }


  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService,
    private formBuilder: FormBuilder) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    if (this.isProfessor) {
      this.form = this.formBuilder.group({
        dateFim: ['', [Validators.required]],
        curso: ['', [Validators.required]],
        materia: ['', [Validators.required]]
      });
    }
  }

  criarAula(): void {
    console.log(this.form.value)
  }

  PreencherMaterias(id: string) {
    this.materias = this.user.curso.find(c => c.id === parseInt(id)).materias;
  }
}



